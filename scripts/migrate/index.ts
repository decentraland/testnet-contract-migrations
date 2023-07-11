import dotenv from "dotenv";
dotenv.config();

import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import fs from "fs";
import { getOriginContractData, getRpcUrl } from "./utils";
import { ChainId, ContractName } from "../common/types";
import {
  constructorFactories,
  contractDeployerPickers,
  deployedContractAddresses,
  deployedContractConstructorHexes,
  deploymentOrder,
  postDeployments,
  targetChainId,
} from "./config";
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

  console.log("Running migrations on chain:", ChainId[targetChainId]);

  try {
    for (const contractName of deploymentOrder) {
      console.log("\n", "---", ContractName[contractName], "---", "\n");

      if (deployedContractAddresses.get(contractName)) {
        console.log("Contract already deployed, skipping...");

        continue;
      }

      const originContractData = getOriginContractData(contractName);

      const { sourceCode, creationCode } = originContractData;

      const contractDeployerPicker = contractDeployerPickers.get(contractName);

      const contractDeployer = contractDeployerPicker?.(signers) ?? signers[0];

      const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode, contractDeployer);

      console.log("Deploying contract...");

      const constructorFactory = constructorFactories.get(contractName);

      const constructorArgs = constructorFactory ? await constructorFactory.getConstructorArgs(signers) : [];

      if (constructorFactory) {
        console.log("With constructor arguments: ", constructorArgs);

        deployedContractConstructorHexes.set(contractName, await constructorFactory.getConstructorArgsHex(signers));
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

  const constructors = Array.from(deployedContractConstructorHexes.entries()).reduce(
    (acc, next) => ({ ...acc, [ContractName[next[0]]]: next[1] }),
    {}
  );

  fs.writeFileSync(`${migrationsDir}/${targetChainId}.json`, JSON.stringify({ addresses, constructors }, null, 2));

  console.log("Closing local blockchain...");

  await ganacheServer.close();
}

main();
