import { sourceCodesDir } from "../common/paths";
import { getEtherscanUrl } from "../common/utils";
import { ContractName } from "../common/types";
import { downloadFromEtherscan } from "./downloadFromEtherscan";
import { getOriginContractAddresses, getOriginContractChains } from "./config";

export async function downloadSourceCodes() {
  for (const [name, address] of getOriginContractAddresses()) {
    console.log("Downloading source code data for", ContractName[name]);

    const apiKey = process.env.ETHERSCAN_API_KEY;
    const chainId = getOriginContractChains(name);
    const url = getEtherscanUrl(chainId);

    await downloadFromEtherscan(
      `${url}/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`,
      sourceCodesDir,
      name
    );
  }
}

