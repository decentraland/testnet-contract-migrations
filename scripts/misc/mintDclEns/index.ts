import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import ensControllerAbi from "./EnsControllerAbi.json";
import { SEPOLIA_RPC_URL } from "../../migrate/utils";

async function main() {
  const pks = (process.env.PRIVATE_KEYS as string).split(",");
  const signer = new ethers.Wallet(pks[0], new ethers.JsonRpcProvider(SEPOLIA_RPC_URL));
  const signerAddress = await signer.getAddress();
  console.log("signerAddress", signerAddress);

  const ensControllerAddress = "0x7e02892cfc2Bfd53a75275451d73cF620e793fc0";
  const ensController = new ethers.Contract(ensControllerAddress, ensControllerAbi, signer);

  const salt = ethers.hexlify(ethers.randomBytes(32));
  console.log("salt", salt);

  const ensName = "dcl";
  console.log("ensName", ensName);

  const resolverAddress = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";
  console.log("resolverAddress", resolverAddress);

  const commitment = await ensController.makeCommitmentWithConfig(
    ensName,
    signerAddress,
    salt,
    resolverAddress,
    signerAddress
  );
  console.log("commitment", commitment);

  console.log("committing...");
  const commitTx = await ensController.commit(commitment);
  await commitTx.wait();

  const duration = 315576000;
  console.log("duration", duration);

  const rentPrice = await ensController.rentPrice(ensName, duration);
  console.log("rentPrice", rentPrice);

  const price = Math.trunc(Number(rentPrice) * 1.1).toString();
  console.log("price", price);

  console.log("waiting 60 seconds");
  await new Promise((resolve) => setTimeout(resolve, 60000));

  console.log("registering...");
  const registerWithConfigTx = await ensController.registerWithConfig(
    ensName,
    signerAddress,
    duration,
    salt,
    resolverAddress,
    signerAddress,
    {
      value: price,
    }
  );
  await registerWithConfigTx.wait();

  // After the name is minted. Make sure to transfer it to the DCLRegistrar so dcl.eth subdomains can be minted.
}

main();
