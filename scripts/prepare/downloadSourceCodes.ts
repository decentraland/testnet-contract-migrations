import { sourceCodesDir } from "../../common/paths";
import { ContractName } from "../../common/types";
import { downloadFromEtherscan } from "./downloadFromEtherscan";
import { originContractAddresses } from "./config";

export async function downloadSourceCodes() {
  for (const [name, address] of originContractAddresses) {
    console.log("Downloading source code data for", ContractName[name]);

    await downloadFromEtherscan(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
      sourceCodesDir,
      name
    );
  }
}
