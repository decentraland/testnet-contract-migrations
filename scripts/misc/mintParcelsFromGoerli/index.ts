import dotenv from "dotenv";
dotenv.config();

import { expect } from "chai";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { getAbi, getAddress } from "../../migrate/utils";
import { ContractName } from "../../common/types";
import { ethers } from "ethers";

type GoerliSubgraphParcel = {
  parcel: {
    tokenId: string;
    x: string;
    y: string;
    estate: {
      tokenId: string;
      owner: {
        address: string;
      };
    } | null;
    owner: {
      address: string;
    };
  };
};

type SepoliaSubgraphParcel = {
  parcel: {
    tokenId: string;
  };
};

type ParcelToAssign = {
  x: string;
  y: string;
  beneficiary: string;
};

async function main() {
  const fetchGoerliSubgraphParcels = async (skip: number = 0): Promise<GoerliSubgraphParcel[]> => {
    console.log(`Fetching goerli subgraph parcels - skip ${skip}`);

    const res = await fetch("https://api.thegraph.com/subgraphs/name/decentraland/marketplace-goerli", {
      method: "POST",
      body: JSON.stringify({
        query: `
        {
          nfts(skip:${skip},first:1000,where:{category:parcel}) {
            parcel {
              tokenId
              x
              y
              estate {
                tokenId
                owner {
                  address
                }
              }
              owner {
                address
              }
            }
          }
        }
        `,
      }),
    });

    const json = await res.json();
    const parcels: GoerliSubgraphParcel[] = json.data.nfts;
    const hasMore = parcels.length === 1000;
    const nextParcels = hasMore ? await fetchGoerliSubgraphParcels(skip + 1000) : [];

    return [...parcels, ...nextParcels];
  };

  const fetchSepoliaSubgraphParcels = async (skip: number = 0): Promise<SepoliaSubgraphParcel[]> => {
    console.log(`Fetching sepolia subgraph parcels - skip ${skip}`);

    const res = await fetch("https://api.studio.thegraph.com/query/49472/marketplace-sepolia/version/latest", {
      method: "POST",
      headers: {
        ["content-type"]: "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          nfts(skip:${skip},first:1000,where:{category:parcel}) {
            parcel {
              tokenId
            }
          }
        }
        `,
      }),
    });

    const json = await res.json();
    const parcels: SepoliaSubgraphParcel[] = json.data.nfts;
    const hasMore = parcels.length === 1000;
    const nextParcels = hasMore ? await fetchSepoliaSubgraphParcels(skip + 1000) : [];

    return [...parcels, ...nextParcels];
  };

  const goerliParcels = await fetchGoerliSubgraphParcels();
  const sepoliaParcels = await fetchSepoliaSubgraphParcels();

  console.log("Total Goerli Parcels", goerliParcels.length);
  console.log("Total Sepolia Parcels", sepoliaParcels.length);

  const sepoliaParcelsIds = new Set(sepoliaParcels.map((nft) => nft.parcel.tokenId));
  const filteredGoerliParcels = goerliParcels.filter((nft) => !sepoliaParcelsIds.has(nft.parcel.tokenId));

  console.log("Total Goerli Parcels to assign", filteredGoerliParcels.length);

  const goerliEstateAddress = "0xc9a46712e6913c24d15b46ff12221a79c4e251dc";
  const goerliRentalsAddress = "0x92159c78f0f4523b9c60382bb888f30f10a46b3b";

  const parcelsOwnedByEstates = filteredGoerliParcels.filter((nft) => !!nft.parcel.estate);
  const parcelsOwnedByEstatesAddress = filteredGoerliParcels.filter(
    (nft) => nft.parcel.owner.address === goerliEstateAddress
  );
  const parcelsOwnedByRentals = filteredGoerliParcels.filter(
    (nft) => nft.parcel.owner.address === goerliRentalsAddress
  );
  const estatesOwnedByRentals = filteredGoerliParcels.filter(
    (nft) => nft.parcel.estate?.owner.address === goerliRentalsAddress
  );

  expect(parcelsOwnedByEstates.length).to.equal(parcelsOwnedByEstatesAddress.length);

  console.log("Parcels Owned by Estates", parcelsOwnedByEstates.length);
  console.log("Parcels Owned by Rentals", parcelsOwnedByRentals.length);
  console.log("Estates Owned by Rentals", estatesOwnedByRentals.length);

  const goerliRpcUrl = "https://rpc.decentraland.org/goerli";
  const goerliProvider = new ethers.JsonRpcProvider(goerliRpcUrl);

  const rentalsAbi = getAbi(ContractName.RentalsImplementation);
  const goerliRentals = new ethers.Contract(goerliRentalsAddress, rentalsAbi, goerliProvider);

  const parcelsToAssign: ParcelToAssign[] = [];

  console.log("Processing parcels...");
  for (let i = 0; i < filteredGoerliParcels.length; i++) {
    const goerliParcel = filteredGoerliParcels[i];

    console.log(`${goerliParcel.parcel.x},${goerliParcel.parcel.y} - ${i + 1} / ${filteredGoerliParcels.length}`);

    const push = (beneficiary: string) => {
      parcelsToAssign.push({
        x: goerliParcel.parcel.x,
        y: goerliParcel.parcel.y,
        beneficiary:
          beneficiary.toLowerCase() === "0x4beb03ee9e16d28749c7c01caccdedffec6eadb5" // Old Land Holder
            ? "0xb919da06d5f81777b13fc5cbd48635e19500fbf5" // Dapps Admin
            : beneficiary,
      });
    };

    // Estate containing parcel is rented
    if (goerliParcel.parcel.estate?.owner.address === goerliRentalsAddress) {
      const { lessor } = await goerliRentals.getRental(goerliEstateAddress, goerliParcel.parcel.estate.tokenId);
      push(lessor);
    }
    // Parcel is rented
    else if (goerliParcel.parcel.owner.address === goerliRentalsAddress) {
      const { lessor } = await goerliRentals.getRental(goerliEstateAddress, goerliParcel.parcel.tokenId);
      push(lessor);
    }
    // Parcel is in an Estate
    else if (goerliParcel.parcel.estate) {
      push(goerliParcel.parcel.estate.owner.address);
    }
    // Parcel is not rented nor in an Estate
    else {
      push(goerliParcel.parcel.owner.address);
    }
  }

  console.log("Dumping results...");
  fs.writeFileSync(path.join(__dirname, "parcelsToAssign.json"), JSON.stringify(parcelsToAssign, null, 2));

  const parcelsToAssignByBeneficiary: Map<string, ParcelToAssign[]> = new Map();

  for (const parcelToAssign of parcelsToAssign) {
    const curr = parcelsToAssignByBeneficiary.get(parcelToAssign.beneficiary) ?? [];
    curr.push(parcelToAssign);
    parcelsToAssignByBeneficiary.set(parcelToAssign.beneficiary, curr);
  }

  console.log("Total beneficiaries", parcelsToAssignByBeneficiary.size);

  const parcelsToAssignInBatches: { beneficiary: string; parcelsToAssign: ParcelToAssign[] }[] = [];

  for (const [beneficiary, parcelsToAssign] of parcelsToAssignByBeneficiary.entries()) {
    for (let i = 0; i < parcelsToAssign.length; i++) {
      if (i % 100 === 0) {
        parcelsToAssignInBatches.push({
          beneficiary,
          parcelsToAssign: [],
        });
      }

      parcelsToAssignInBatches[parcelsToAssignInBatches.length - 1].parcelsToAssign.push(parcelsToAssign[i]);
    }
  }

  console.log("Total batches", parcelsToAssignInBatches.length);

  const sepoliaRpcUrl = "https://rpc.decentraland.org/sepolia";
  const sepoliaProvider = new ethers.JsonRpcProvider(sepoliaRpcUrl);
  const pks = (process.env.PRIVATE_KEYS as string).split(",");
  const proxyOwner = new ethers.Wallet(pks[1], sepoliaProvider);
  const landAbi = getAbi(ContractName.LANDRegistry);
  const sepoliaLandAddress = getAddress(ContractName.LANDProxy);
  const sepoliaLand = new ethers.Contract(sepoliaLandAddress, landAbi, proxyOwner);

  for (let i = 0; i < parcelsToAssignInBatches.length; i++) {
    const { beneficiary, parcelsToAssign } = parcelsToAssignInBatches[i];

    const xs: string[] = [];
    const ys: string[] = [];

    for (const parcelToAssign of parcelsToAssign) {
      xs.push(parcelToAssign.x);
      ys.push(parcelToAssign.y);
    }

    console.log(`Assigning multiple parcels for ${beneficiary}`);
    console.log(`Parcels to assign ${parcelsToAssign.length}`);
    console.log(`Batch ${i + 1} of ${parcelsToAssignInBatches.length}`);

    const assignMultipleParcelsTx = await sepoliaLand.assignMultipleParcels(xs, ys, beneficiary);
    await assignMultipleParcelsTx.wait();
  }

  console.log("Done!");
}

main();
