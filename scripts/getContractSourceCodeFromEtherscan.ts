import dotenv from "dotenv";
import { getFromEtherscan } from "./utils/getFromEtherscan";

async function main() {
  dotenv.config();

  const apiKey = process.env.ETHERSCAN_API_KEY;

  getFromEtherscan(
    (address) =>
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`,
    __filename,
    (result) => result
  );
}

main();
