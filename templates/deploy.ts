import { ethers } from "hardhat";
import ethProvider from "eth-provider";
import { verifyContract } from "../scripts/utils";

const { CHAIN_ID } = process.env;

async function main() {
  if (CHAIN_ID === undefined) {
    throw new Error("ChainId not found");
  }

  const chainId = Number(CHAIN_ID);

  const frame = ethProvider("frame");
  frame.setChain(chainId);

  const provider = new ethers.providers.Web3Provider(frame as any);
  const signer = await provider.getSigner();

  if (!signer) {
    throw new Error("Signer not found");
  }

  // CONSTRUCTOR_ARGUMENTS
  const CONTRACT_NAME = await ethers.getContractFactory(
    "CONTRACT_NAME",
    signer
  );
  const contract = await CONTRACT_NAME.deploy();

  await contract.deployed();

  console.log(`CONTRACT_NAME deployed to ${contract.address}`);

  await verifyContract("CONTRACT_NAME", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
