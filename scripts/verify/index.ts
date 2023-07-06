import dotenv from "dotenv";
dotenv.config();

import fetch from 'node-fetch'
import { deployedContractConstructorHexes, deploymentOrder } from "../migrate/config";
import { getAddress, getSourceCodeData } from "../migrate/utils";
import { ContractName } from "../common/types";

async function main() {
  for (const contractName of deploymentOrder) {
    console.log(`\n--- ${ContractName[contractName]} ---\n`);

    // Wait a second to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const sourceCodeData = getSourceCodeData(contractName);

    const constructorHex = deployedContractConstructorHexes.get(contractName) ?? "";

    const parameters = new URLSearchParams({
      apikey: process.env.ETHERSCAN_API_KEY!,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: getAddress(contractName),
      sourceCode: sourceCodeData.SourceCode,
      codeformat: "solidity-single-file",
      contractname: sourceCodeData.ContractName,
      compilerversion: sourceCodeData.CompilerVersion,
      optimizationUsed: sourceCodeData.OptimizationUsed,
      runs: sourceCodeData.Runs,
      constructorArguements: constructorHex.replace("0x", ""),
    });

    const res = await fetch("https://api-sepolia.etherscan.io/api", {
      method: "post",
      body: parameters,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const json = await res.json();

    console.log(json.status, json.result);
  }
}

main();
