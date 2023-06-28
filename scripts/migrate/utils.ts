import { ChainId } from "../common/types";

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
