import { GANACHE_RPC_URL, SEPOLIA_RPC_URL } from "../common/constants";
import { ChainId } from "../common/types";

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
