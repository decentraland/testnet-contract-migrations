import fs from "fs";
import { contractAddressesMap } from "../../src/config";
import { creationDataDir } from "../../src/paths";
import { downloadFromEtherscan } from "./downloadFromEtherscan";
import { ContractName } from "../../src/types";

export async function downloadCreationData() {
  fs.rmSync(creationDataDir, { recursive: true, force: true });

  for (const [name, address] of contractAddressesMap) {
    console.log("Downloading creation data for", ContractName[name]);

    await downloadFromEtherscan(
      `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
      creationDataDir,
      name
    );
  }
}
