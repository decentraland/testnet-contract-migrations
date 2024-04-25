import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { deployedContractConstructorHexes, getDeploymentOrder } from "../migrate/config";
import { getEtherscanUrl, targetChainId } from "../common/utils";
import { getAddress, getSourceCodeData } from "../migrate/utils";
import { ContractName } from "../common/types";

async function main() {
  for (const contractName of getDeploymentOrder()) {
    console.log(`\n--- ${ContractName[contractName]} ---\n`);

    // Wait a second to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const sourceCodeData = getSourceCodeData(contractName);

    const constructorHex = deployedContractConstructorHexes.get(contractName) ?? "";

    let sourceCode = sourceCodeData.SourceCode;
    let contractFile: string | undefined;

    // All source codes in this format start with {{\r\n
    const isStandardJsonInput = sourceCodeData.SourceCode.startsWith("{{\r\n");

    if (isStandardJsonInput) {
      // For it to be a valid JSON I need to remove the wrapping {}
      sourceCode = sourceCode.slice(1, -1);

      const sourceCodeJson = JSON.parse(sourceCode);

      // This source code format requires that the Contract Name is prefixed with the name of the file containing it.
      // To do this I need find the file that contains the main contract
      for (const key in sourceCodeJson.sources) {
        if ((sourceCodeJson.sources[key].content as string).includes(`contract ${sourceCodeData.ContractName}`)) {
          contractFile = key;
          break;
        }
      }

      if (!contractFile) {
        throw new Error(`Contract name not found in ${ContractName[contractName]} source code`);
      }
    }

    const parameters = new URLSearchParams({
      apikey: process.env.ETHERSCAN_API_KEY!,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: getAddress(contractName),
      sourceCode,
      codeformat: isStandardJsonInput ? "solidity-standard-json-input" : "solidity-single-file",
      contractname: isStandardJsonInput
        ? `${contractFile}:${sourceCodeData.ContractName}`
        : sourceCodeData.ContractName,
      compilerversion: sourceCodeData.CompilerVersion,
      optimizationUsed: sourceCodeData.OptimizationUsed,
      runs: sourceCodeData.Runs,
      constructorArguements: constructorHex.replace("0x", ""),
    });

    const res = await fetch(`${getEtherscanUrl(targetChainId)}/api`, {
      method: "post",
      body: parameters,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const json = await res.json();

    console.log(json.status, json.result);
  }
}

main();
