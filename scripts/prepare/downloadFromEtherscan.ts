import fetch from "node-fetch";
import fs from "fs";
import { ContractName } from "../common/types";

export async function downloadFromEtherscan(url: string, outputDir: string, contractName: ContractName) {
  const res = await fetch(url);

  const json = await res.json();

  if (json.status !== "1") {
    throw new Error(`Invalid status: ${json.status}`);
  }
  
  fs.writeFileSync(`${outputDir}/${ContractName[contractName]}.json`, JSON.stringify(json.result[0], null, 2));
}
