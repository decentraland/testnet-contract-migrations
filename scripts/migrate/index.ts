import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider } from "ganache";
import dotenv from "dotenv";
import { ChainId, ContractName } from "../../src/types";
import { deploymentOrder, targetChainId } from "../../src/config";
import { GANACHE_URL } from "../../src/constants";
import { loadContractData } from "./loadContractData";

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

  const contractDataMap = loadContractData();

  console.log(contractDataMap);

  for (const contractName of deploymentOrder) {
    const contractData = contractDataMap.get(contractName)!;

    const { sourceCode, creationCode } = contractData.origin;

    const factory = new ethers.ContractFactory(sourceCode.ABI, creationCode[0], signer1);

    console.log("Deploying", ContractName[contractName]);

    const contract = await factory.deploy();

    await contract.waitForDeployment();

    contractData.address = await contract.getAddress();
  }

  await ganacheServer.close();
}

main();
