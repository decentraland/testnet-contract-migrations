import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import contracts from "./contracts.json";

async function main() {
  dotenv.config();

  for (const [name, address] of Object.entries(contracts)) {
    console.log("Downloading source code for:", name);

    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );

    const json = await response.json();

    if (json.status !== "1") {
      throw new Error(`Failed to download source code. Invalid status: ${json.status}`);
    }

    const target = path.resolve(__dirname, `../../output/getSourceCodeFromEtherscan/${name}.json`);

    fs.mkdirSync(path.dirname(target), { recursive: true });

    fs.writeFileSync(target, JSON.stringify(json.result, null, 2));
  }
}

main();
