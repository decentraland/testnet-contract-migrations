import fs from "fs";
import { creationCodesDir, sourceCodesDir } from "../common/paths";
import { ContractName } from "../common/types";
import { deploymentOrder } from "./config";
import { ChainId, OriginContractData, SourceCodeData } from "./types";

export const GANACHE_RPC_URL = "http://localhost:8545";
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

export function getRpcUrl(chainId: ChainId): string {
  switch (chainId) {
    case ChainId.GANACHE:
      return GANACHE_RPC_URL;
    case ChainId.SEPOLIA:
      return SEPOLIA_RPC_URL;
    default:
      throw new Error("Chain ID not supported");
  }
}

export function loadOriginContractsData() {
  const originContractDataMap = new Map<ContractName, OriginContractData>();

  for (const contractName of deploymentOrder) {
    console.log("Loading contract data for", ContractName[contractName]);

    const sourceCode = load<SourceCodeData>(sourceCodesDir, contractName);
    const creationCode = removeConstructorArgs(load<[string]>(creationCodesDir, contractName)[0], sourceCode);

    originContractDataMap.set(contractName, {
      creationCode,
      sourceCode,
    });
  }

  return originContractDataMap;

  function load<T>(dir: string, contractName: ContractName): T {
    return JSON.parse(fs.readFileSync(`${dir}/${ContractName[contractName]}.json`, `utf-8`));
  }

  function removeConstructorArgs(creationCode: string, sourceCodeData: SourceCodeData): string {
    return creationCode[0].replace(new RegExp(`${sourceCodeData.ConstructorArguments}$`), "");
  }
}
