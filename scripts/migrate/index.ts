import dotenv from "dotenv";
dotenv.config();

import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import { getRpcUrl } from "./utils";
import { ChainId, ContractName } from "../common/types";
import {
  constructorFactories,
  contractDeployers,
  deployedContractAddresses,
  deploymentOrder,
  originContractsData,
  postDeployments,
  targetChainId,
} from "./config";

async function main() {
  const ganacheServer = ganache.server({});

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

  for (const contractName of deploymentOrder) {
    const originContractData = originContractsData.get(contractName);

    if (!originContractData) {
      throw new Error("Origin contract data not found");
    }

    const { sourceCode, creationCode } = originContractData;

    const contractDeployer = contractDeployers.get(contractName);

    if (!contractDeployer) {
      throw new Error("Contract deployer not found");
    }

    const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode[0], contractDeployer(signers));

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
  }

  await ganacheServer.close();
}

main();
