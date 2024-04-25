import { ChainId } from "./types"

export const originChainId: ChainId = (() => {
  const num = Number(process.env.ORIGIN_CHAIN_ID ?? ChainId.MAINNET)

  if (!ChainId[num]) {
    throw new Error('Invalid ORIGIN_CHAIN_ID')
  }

  return num
})()

export const targetChainId: ChainId = (() => {
  const env = process.env.TARGET_CHAIN_ID;

  if (!env) {
    throw new Error("TARGET_CHAIN_ID env var not found");
  }

  const num = Number(env);

  if (!ChainId[num]) {
    throw new Error("Invalid TARGET_CHAIN_ID");
  }

  return num;
})();

export const forkChainId: ChainId | undefined = (() => {
  const env = process.env.FORK_CHAIN_ID;

  if (!env) {
    return undefined;
  }

  const num = Number(env);

  if (!ChainId[num]) {
    throw new Error("Invalid FORK_CHAIN_ID");
  }

  return num;
})()

export function isEthereumNetwork(chainId: ChainId): boolean {
  return [ChainId.MAINNET, ChainId.GOERLI, ChainId.SEPOLIA].includes(chainId)
}

export function isPolygonNetwork(chainId: ChainId): boolean {
  return [ChainId.MATIC, ChainId.MUMBAI, ChainId.AMOY].includes(chainId)
}


export function getEtherscanUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return "https://api.etherscan.io";
    case ChainId.GOERLI:
      return "https://api-goerli.etherscan.io";
    case ChainId.MATIC:
      return "https://api.polygonscan.com";
    case ChainId.MUMBAI:
      return "https://api-testnet.polygonscan.com";
    case ChainId.AMOY:
      return "https://api-amoy.polygonscan.com";
    default:
      throw new Error(`Etherscan URL not found for chain ${chainId}`);
  }
}
