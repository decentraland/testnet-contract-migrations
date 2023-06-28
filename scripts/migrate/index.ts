import dotenv from "dotenv";
dotenv.config();

import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import { ChainId, ContractName, DeployedContractAddresses } from "../../src/types";
import { constructorArgsFactories, deploymentOrder, postDeploymentInstructions, targetChainId } from "../../src/config";
import { loadOriginContractData } from "./loadOriginContractData";
import { getRpcUrl } from "../../src/utils";

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

  const originContractDataMap = loadOriginContractData();

  const deployedContractAddresses: DeployedContractAddresses = new Map();

  for (const contractName of deploymentOrder) {
    const originContractData = originContractDataMap.get(contractName);

    if (!originContractData) {
      throw new Error("Origin contract data not found");
    }

    const { sourceCode, creationCode } = originContractData;

    const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode[0], signers[0]);

    console.log("Deploying", ContractName[contractName]);

    const getConstructorValues = constructorArgsFactories.get(contractName);

    const constructorValues = getConstructorValues?.({ originContractDataMap, deployedContractAddresses }) ?? [];

    const contract = await factory.deploy(...constructorValues);

    await contract.waitForDeployment();

    deployedContractAddresses.set(contractName, await contract.getAddress());

    const onPostDeployment = postDeploymentInstructions.get(contractName);

    if (onPostDeployment) {
      await onPostDeployment({ originContractDataMap, deployedContractAddresses, signers });
    }
  }

  await ganacheServer.close();
}

main();
