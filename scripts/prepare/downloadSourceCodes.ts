import { sourceCodesDir } from "../../common/paths";
import { downloadFromEtherscan } from "./downloadFromEtherscan";
import { ContractName } from "../../common/types";
import { contractAddressesMap } from "./config";

export async function downloadSourceCodes() {
  for (const [name, address] of contractAddressesMap) {
    console.log("Downloading source code data for", ContractName[name]);

    await downloadFromEtherscan(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
      sourceCodesDir,
      name
    );
  }
}
