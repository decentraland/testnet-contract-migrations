import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { contractAddressesMap } from "../../src/config";
import { creationCodesDir, sourceCodesDir } from "../../src/paths";
import { ContractName, SourceCodeData } from "../../src/types";
import { spawnSync } from "child_process";

export async function downloadCreationCode() {
  for (const [name, address] of contractAddressesMap) {
    console.log("Downloading creation code for", ContractName[name]);

    const res = spawnSync(path.resolve(__dirname, "downloadCreationCode.sh"), { env: { CONTRACT_ADDRESS: address } });

    const html = res.stdout.toString();

    const $ = cheerio.load(html);

    let creationCode = $("#verifiedbytecode2").text();

    const sourceCodeDataContent = fs.readFileSync(`${sourceCodesDir}/${ContractName[name]}.json`, "utf-8");

    const sourceCodeData: SourceCodeData = JSON.parse(sourceCodeDataContent);

    creationCode = creationCode.replace(new RegExp(`${sourceCodeData.ConstructorArguments}$`), "");

    if (!creationCode) {
      throw new Error("Creation code not found");
    }

    fs.mkdirSync(creationCodesDir, { recursive: true });

    fs.writeFileSync(`${creationCodesDir}/${ContractName[name]}.json`, JSON.stringify([creationCode], null, 2));
  }
}
