import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { contracts } from "./utils/contracts";
import { outputPath } from "./utils/paths";
import { getFromEtherscan } from "./utils/getFromEtherscan";

async function main() {
  dotenv.config();

  const apiKey = process.env.ETHERSCAN_API_KEY;

  getFromEtherscan(
    (address) =>
      `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${apiKey}`,
    __filename,
    (result) => result
  );
}

main();
