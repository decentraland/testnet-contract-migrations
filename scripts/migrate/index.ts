import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import dotenv from "dotenv";
import { ChainId, ContractName, DeployedContractAddresses } from "../../src/types";
import { constructorArgsFactories, deploymentOrder, targetChainId } from "../../src/config";
import { GANACHE_URL } from "../../src/constants";
import { loadOriginContractData } from "./loadOriginContractData";

async function main() {
  dotenv.config();

  const ganacheServer = ganache.server({});

  const ganacheProvider = await new Promise<EthereumProvider>((resolve, reject) => {
    ganacheServer.listen(8545, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(ganacheServer.provider);
    });
  });

  const provider = ethers.getDefaultProvider(targetChainId === ChainId.GANACHE ? GANACHE_URL : targetChainId);

  const [signer1]: Signer[] =
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

    const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode[0], signer1);

    console.log("Deploying", ContractName[contractName]);

    const getConstructorValues = constructorArgsFactories.get(contractName);

    const constructorValues = getConstructorValues?.(originContractData, deployedContractAddresses) ?? [];

    const contract = await factory.deploy(...constructorValues);

    await contract.waitForDeployment();

    deployedContractAddresses.set(contractName, await contract.getAddress());
  }

  await ganacheServer.close();
}

main();
