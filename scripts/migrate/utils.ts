import { ChainId, ContractName } from "../common/types";
import { deployedContractAddresses, originContractsData } from "./config";
import { OriginContractData, SourceCodeData } from "./types";

export const GANACHE_RPC_URL = "http://localhost:8545";
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const AMOY_RPC_URL = 'https://rpc.decentraland.org/amoy'

export function getRpcUrl(chainId: ChainId): string {
  switch (chainId) {
    case ChainId.GANACHE:
      return GANACHE_RPC_URL;
    case ChainId.SEPOLIA:
      return SEPOLIA_RPC_URL;
    case ChainId.AMOY:
      return AMOY_RPC_URL;
    default:
      throw new Error("Chain ID not supported");
  }
}

export function getAddress(contract: ContractName): string {
  const address = deployedContractAddresses.get(contract);
  if (!address) throw new Error(`Address not found for ${ContractName[contract]}`);
  return address;
}

export function getSourceCodeData(contract: ContractName): SourceCodeData {
  const sourceCodeData = originContractsData.get(contract)?.sourceCode;
  if (!sourceCodeData) throw new Error(`Source code data not found for ${ContractName[contract]}`);
  return sourceCodeData;
}

export function getAbi(contract: ContractName): string {
  return getSourceCodeData(contract).ABI;
}

export function getOriginContractData(contract: ContractName): OriginContractData {
  const originContractData = originContractsData.get(contract);
  if (!originContractData) throw new Error(`Origin contract data not found for ${ContractName[contract]}`);
  return originContractData;
}
