import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import ganache from "ganache";
import { ethers } from "ethers";
import { SEPOLIA_RPC_URL, getAbi, getAddress } from "../../migrate/utils";
import { ContractName } from "../../common/types";
import batches from "./batches.json";

async function main() {
  const rpcUrl = SEPOLIA_RPC_URL;

  //   const ganacheServer = ganache.server({
  //     logging: {
  //       quiet: true,
  //     },
  //     fork: {
  //       url: SEPOLIA_RPC_URL,
  //     },
  //   });

  //   await new Promise<void>((resolve, reject) => {
  //     ganacheServer.listen(8545, (err) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       resolve();
  //     });
  //   });

  const pks = (process.env.PRIVATE_KEYS as string).split(",");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const [admin, proxyAdmin] = pks.map((pk) => new ethers.Wallet(pk, provider));
  const adminAddress = await admin.getAddress();
  const landAddress = getAddress(ContractName.LANDProxy);
  const landAbi = getAbi(ContractName.LANDRegistry);
  const land = new ethers.Contract(landAddress, landAbi, proxyAdmin);

  for (let i = 0; i < batches.length; i++) {
    const { xs, ys } = batches[i];

    console.log("Minting batch", i + 1, "of", batches.length);
    try { 
      const assignMultipleParcelsTx = await land.assignMultipleParcels(xs, ys, adminAddress, { gasLimit: 10000000 });
      await assignMultipleParcelsTx.wait();
    } catch (e) {
      fs.writeFileSync(path.join(__dirname, "batchesRemaining.json"), JSON.stringify(batches.slice(i), null, 2));
      throw new Error("Error minting batch " + (i + 1) + ": " + (e as Error).message);
    }
  }

  //   await ganacheServer.close();
}

main();
