import dotenv from "dotenv";
dotenv.config();

import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import fs from "fs";
import { getRpcUrl, verifyContract } from "./utils";
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

  fs.rmSync(migrationsDir, { recursive: true, force: true });

  for (const contractName of deploymentOrder) {
    const originContractData = originContractsData.get(contractName);

    if (!originContractData) {
      throw new Error("Origin contract data not found");
    }

    const { sourceCode, creationCode } = originContractData;

    const contractDeployer = contractDeployers.get(contractName);

    const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode, contractDeployer?.(signers) ?? signers[0]);

    console.log("Deploying", ContractName[contractName]);

    const constructorFactory = constructorFactories.get(contractName);

    const constructorValues = constructorFactory?.getConstructorArgs() ?? [];

    const contract = await factory.deploy(...constructorValues);

    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();

    deployedContractAddresses.set(contractName, contractAddress);

    const postDeployment = postDeployments.get(contractName);

    if (postDeployment) {
      await postDeployment.exec(signers);
    }

    if (targetChainId !== ChainId.GANACHE) {
      const constructorHex = constructorFactory?.getConstructorArgsHex() ?? "";

      await verifyContract(contractAddress, sourceCode, constructorHex);
    }

    fs.mkdirSync(migrationsDir, { recursive: true });

    fs.writeFileSync(
      `${migrationsDir}/${ContractName[contractName]}.json`,
      JSON.stringify({ address: contractAddress }, null, 2)
    );
  }

  await ganacheServer.close();
}

main();
