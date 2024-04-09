import { sourceCodesDir } from "../common/paths";
import { ChainId, ContractName } from "../common/types";
import { downloadFromEtherscan } from "./downloadFromEtherscan";
import { getOriginContractAddresses, getOriginContractChains } from "./config";

export async function downloadSourceCodes() {
  for (const [name, address] of getOriginContractAddresses()) {
    console.log("Downloading source code data for", ContractName[name]);

    const apiKey = process.env.ETHERSCAN_API_KEY;
    const chainId = getOriginContractChains(name) || ChainId.MAINNET;
    const url = getEtherscanUrl(chainId);

    await downloadFromEtherscan(
      `${url}/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`,
      sourceCodesDir,
      name
    );
  }
}

function getEtherscanUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return "https://api.etherscan.io";
    case ChainId.GOERLI:
      return "https://api-goerli.etherscan.io";
    case ChainId.POLYGON:
      return "https://api.polygonscan.com";
    case ChainId.MUMBAI:
      return "https://api-testnet.polygonscan.com";
    default:
      throw new Error(`Etherscan URL not found for chain ${chainId}`);
  }
}
