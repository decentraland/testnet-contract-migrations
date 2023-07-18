import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import fetch from "node-fetch";
import { ContractName } from "../../common/types";
import { SEPOLIA_RPC_URL, getAbi, getAddress } from "../../migrate/utils";

type SubgraphNFT = {
  name: string;
  owner: {
    address: string;
  };
};

async function main() {
  const res = await fetch("https://api.thegraph.com/subgraphs/name/decentraland/marketplace-goerli", {
    method: "POST",
    body: JSON.stringify({
      query: `
            {
              nfts(first:1000,where:{category:ens}) {
                name
                owner {
                  address
                }
              }
            }
            `,
    }),
  });

  const json = await res.json();

  const nfts: SubgraphNFT[] = json.data.nfts;

  const rpcUrl = SEPOLIA_RPC_URL;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const pks = (process.env.PRIVATE_KEYS as string).split(",");
  const signer = new ethers.Wallet(pks[0], provider);

  const manaAbi = getAbi(ContractName.MANAToken);
  const manaAddress = getAddress(ContractName.MANAToken);
  const mana = new ethers.Contract(manaAddress, manaAbi, signer);

  const dclControllerAbi = getAbi(ContractName.DCLControllerV2);
  const dclControllerAddress = getAddress(ContractName.DCLControllerV2);
  const dclController = new ethers.Contract(dclControllerAddress, dclControllerAbi, signer);

  console.log("Revoke approval...");
  const approve1Tx = await mana.approve(dclControllerAddress, 0n);
  await approve1Tx.wait(1);

  console.log("Approval...");
  const approve2Tx = await mana.approve(dclControllerAddress, ethers.toBigInt(nfts.length) * ethers.parseEther("100"));
  await approve2Tx.wait(1);

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    try {
      console.log(`Minting ${nft.name} to ${nft.owner.address}... ${i + 1}/${nfts.length}`);
      const registerTx = await dclController.register(nft.name, nft.owner.address);
      await registerTx.wait(1);
    } catch (e) {
      console.error(`Error minting ${nft.name}: ${(e as Error).message}`);
    }
  }
}

main();
