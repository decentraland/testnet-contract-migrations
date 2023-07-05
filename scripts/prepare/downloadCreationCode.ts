import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { spawnSync } from "child_process";
import { creationCodesDir } from "../common/paths";
import { ContractName } from "../common/types";
import { originContractAddresses } from "./config";

export async function downloadCreationCode() {
  for (const [name, address] of originContractAddresses) {
    console.log("Downloading creation code for", ContractName[name]);

    const res = spawnSync(path.resolve(__dirname, "downloadCreationCode.sh"), { env: { CONTRACT_ADDRESS: address } });

    const html = res.stdout.toString();

    const $ = cheerio.load(html);

    const creationCode = $("#verifiedbytecode2").text();

    if (!creationCode) {
      throw new Error("Creation code not found");
    }

    fs.writeFileSync(`${creationCodesDir}/${ContractName[name]}.json`, JSON.stringify([creationCode], null, 2));
  }
}
