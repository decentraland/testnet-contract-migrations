import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { contractAddressesMap } from "../../src/config";
import { creationCodesDir } from "../../src/paths";
import { ContractName } from "../../src/types";
import { spawnSync } from "child_process";

export async function downloadCreationCode() {
  fs.rmSync(creationCodesDir, { recursive: true, force: true });

  for (const [name, address] of contractAddressesMap) {
    console.log("Downloading creation code for", ContractName[name]);

    const res = spawnSync(path.resolve(__dirname, "downloadCreationCode.sh"), { env: { CONTRACT_ADDRESS: address } });

    const html = res.stdout.toString();

    const $ = cheerio.load(html);

    const creationCode = $("#verifiedbytecode2").text();

    if (!creationCode) {
      throw new Error("Creation code not found");
    }

    fs.mkdirSync(creationCodesDir, { recursive: true });

    fs.writeFileSync(`${creationCodesDir}/${ContractName[name]}.json`, JSON.stringify([creationCode], null, 2));
  }
}
