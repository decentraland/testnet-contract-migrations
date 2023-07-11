import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { spawnSync } from "child_process";
import { creationCodesDir } from "../common/paths";
import { ChainId, ContractName } from "../common/types";
import { originContractAddresses, originContractChains } from "./config";

export async function downloadCreationCode() {
  for (const [name, address] of originContractAddresses) {
    console.log("Downloading creation code for", ContractName[name]);

    const chainId = originContractChains.get(name) || ChainId.MAINNET;
    const url = getEtherscanUrl(chainId);
    const res = spawnSync(path.resolve(__dirname, "downloadCreationCode.sh"), {
      env: { ETHERSCAN_URL: url, CONTRACT_ADDRESS: address },
    });
    const html = res.stdout.toString();
    const $ = cheerio.load(html);
    const creationCode = $("#verifiedbytecode2").text();

    if (!creationCode) {
      throw new Error("Creation code not found");
    }

    fs.writeFileSync(`${creationCodesDir}/${ContractName[name]}.json`, JSON.stringify([creationCode], null, 2));
  }
}

function getEtherscanUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return "https://etherscan.io";
    case ChainId.GOERLI:
      return "https://goerli.etherscan.io";
    default:
      throw new Error(`Etherscan URL not found for chain ${chainId}`);
  }
}
