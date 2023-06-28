import fs from "fs";
import { contractAddressesMap } from "../../src/config";
import { sourceCodesDir } from "../../src/paths";
import { downloadFromEtherscan } from "./downloadFromEtherscan";
import { ContractName } from "../../src/types";

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
