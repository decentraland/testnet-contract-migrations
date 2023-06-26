import fetch from "node-fetch";
import dotenv from "dotenv";
import { AbstractProvider, Signer, ethers } from "ethers";
import ganache, { EthereumProvider, Server } from "ganache";
import { ChainId, ContractName, CreationData, SourceCodeData } from "../src/types";
import { contractDataMap, deploymentOrder, migrationData } from "../src/config";

async function main() {
  dotenv.config();

  let ganacheServer: Server<"ethereum"> | undefined;

  const originChainId = migrationData.origin.chainId;
  const targetChainId = migrationData.target.chainId;

  const originProvider = ethers.getDefaultProvider(originChainId);
  const targetProvider = ethers.getDefaultProvider(
    targetChainId === ChainId.GANACHE ? "http://localhost:8545" : targetChainId
  );

  const signers: Signer[] = await (async () => {
    if (targetChainId === ChainId.GANACHE) {
      const server = ganache.server({});

      const provider = await new Promise<EthereumProvider>((resolve, reject) => {
        server.listen(8545, (err) => {
          if (err) {
            return reject(err);
          }

          ganacheServer = server;

          resolve(server.provider);
        });
      });

      return new ethers.BrowserProvider(provider).listAccounts();
    }

    const privateKeysEnv = process.env.PRIVATE_KEYS;

    if (!privateKeysEnv) {
      throw new Error("PRIVATE_KEYS not found");
    }

    const privateKeys = privateKeysEnv.split(",");

    return privateKeys.map((privateKey) => new ethers.Wallet(privateKey, targetProvider as AbstractProvider));
  })();

  for (const contract of deploymentOrder) {
    console.log(`Deployment process for ${ContractName[contract]}`);

    const contractData = contractDataMap.get(contract);

    if (!contractData) {
      throw new Error(`Contract data not found for ${ContractName[contract]}`);
    }

    console.log(`Fetching source code data...`);

    contractData.origin.sourceCodeData = await fetchSourceCodeData(contractData.origin.address, originChainId);

    console.log(`Fetching creation data...`);

    contractData.origin.creationData = await fetchCreationData(contractData.origin.address, originChainId);

    console.log(`Fetching creation input data...`);

    const inputData = await fetchCreationInputData(originProvider, contractData.origin.creationData.txHash);

    if (contractData.origin.sourceCodeData.ConstructorArguments) {
      throw new Error("Not supported");
    }

    console.log(`Deploying contract...`);

    contractData.target.address = await deployContract(signers[0], inputData);

    console.log(`${ContractName[contract]} deployed at ${contractData.target.address}`);

    if (contractData.target.getInitializationData) {
      console.log("Initializing contract...");

      await initializeContract(signers[0], contractData.target.getInitializationData(), contractData.target.address);
    }
  }

  if (ganacheServer) {
    await ganacheServer.close();
  }
}

main();

async function fetchSourceCodeData(address: string, chainId: ChainId): Promise<SourceCodeData> {
  return fetchFromEtherscan(
    chainId,
    `?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
}

async function fetchCreationData(address: string, chainId: ChainId): Promise<CreationData> {
  return fetchFromEtherscan(
    chainId,
    `?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
}

async function fetchFromEtherscan(chainId: ChainId, params: string) {
  let baseUrl;

  switch (chainId) {
    case ChainId.MAINNET:
      baseUrl = "https://api.etherscan.io/api";
      break;
    // TODO: Add more chains.
    default:
      throw new Error(`Invalid chainId: ${chainId}`);
  }

  const url = baseUrl + params;
  const result = await fetch(url);
  const json = await result.json();

  if (json.status !== "1") {
    throw new Error(`Invalid status: ${json.status}. Message: ${json.message}`);
  }

  return json.result[0];
}

async function fetchCreationInputData(provider: AbstractProvider, txHash: string) {
  const receipt = await provider.getTransactionReceipt(txHash);

  if (!receipt) {
    throw new Error("Transaction receipt not found");
  }

  if (!receipt.contractAddress) {
    throw new Error("Contract not deployed on this transaction");
  }

  return (await receipt.getTransaction()).data;
}

async function deployContract(signer: Signer, inputData: string) {
  const transactionResponse = await signer.sendTransaction({
    data: inputData,
  });

  const transactionReceipt = await transactionResponse.wait();

  if (!transactionReceipt) {
    throw new Error("Transaction receipt not found");
  }

  if (!transactionReceipt.contractAddress) {
    throw new Error("Contract not deployed on this transaction");
  }

  return transactionReceipt.contractAddress;
}

async function initializeContract(signer: Signer, initializationData: string, contractAddress: string): Promise<void> {
  const transactionResponse = await signer.sendTransaction({
    to: contractAddress,
    data: initializationData,
  });

  const transactionReceipt = await transactionResponse.wait();

  if (!transactionReceipt) {
    throw new Error("Transaction receipt not found");
  }
}
