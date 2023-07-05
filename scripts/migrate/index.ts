import dotenv from "dotenv";
dotenv.config();

import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import fs from "fs";
import { getRpcUrl } from "./utils";
import { ContractName } from "../common/types";
import {
  constructorFactories,
  contractDeployers,
  deployedContractAddresses,
  deploymentOrder,
  originContractsData,
  postDeployments,
  targetChainId,
} from "./config";
import { ChainId } from "./types";
import { migrationsDir } from "./paths";

async function main() {
  const ganacheServer = ganache.server({
    logging: {
      quiet: true,
    },
    fork: {
      url: getRpcUrl(ChainId.SEPOLIA),
    },
  });

  const ganacheProvider = await new Promise<EthereumProvider>((resolve, reject) => {
    ganacheServer.listen(8545, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(ganacheServer.provider);
    });
  });

  const provider = new ethers.JsonRpcProvider(getRpcUrl(targetChainId));

  const signers: Signer[] =
    targetChainId === ChainId.GANACHE
      ? await new ethers.BrowserProvider(ganacheProvider).listAccounts()
      : process.env.PRIVATE_KEYS!.split(",").map((pk) => new ethers.Wallet(pk, provider as AbstractProvider));

  try {
    for (const contractName of deploymentOrder) {
      console.log("\n", "---", ContractName[contractName], "---", "\n");

      const originContractData = originContractsData.get(contractName);

      if (!originContractData) {
        throw new Error("Origin contract data not found");
      }

      const { sourceCode, creationCode } = originContractData;

      const contractDeployerFunc = contractDeployers.get(contractName);

      const contractDeployer = contractDeployerFunc?.(signers) ?? signers[0];

      const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode, contractDeployer);

      console.log("Deploying contract...");

      const constructorFactory = constructorFactories.get(contractName);

      const constructorArgs = constructorFactory ? await constructorFactory.getConstructorArgs(signers) : [];

      if (constructorArgs.length) {
        console.log("With constructor arguments: ", constructorArgs);
      }

      const contract = await factory.deploy(...constructorArgs);

      await contract.waitForDeployment();

      const contractAddress = await contract.getAddress();

      deployedContractAddresses.set(contractName, contractAddress);

      console.log("Contract deployed at:", contractAddress);

      console.log("Contract deployed by:", await contractDeployer.getAddress());

      const postDeployment = postDeployments.get(contractName);

      if (postDeployment) {
        console.log("Running post deployment...");

        await postDeployment.exec(signers);
      }

      console.log(`Finished ${ContractName[contractName]} deployment :D`);
    }
  } catch (e) {
    console.log("!!!Migration failed!!!");

    console.error(e);
  }

  console.log("Storing results...");

  const addresses = Array.from(deployedContractAddresses.entries()).reduce(
    (acc, next) => ({ ...acc, [ContractName[next[0]]]: next[1].toLowerCase() }),
    {}
  );

  fs.writeFileSync(`${migrationsDir}/${targetChainId}.json`, JSON.stringify(addresses, null, 2));

  console.log("Closing local blockchain...");

  await ganacheServer.close();
}

main();
