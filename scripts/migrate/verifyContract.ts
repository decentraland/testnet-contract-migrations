import fetch from "node-fetch";
import { SourceCodeData } from "../../common/types";

export async function verifyContract(
  contractAddress: string,
  sourceCodeData: SourceCodeData,
  constructorArguments: string
) {
  const parameters = new URLSearchParams({
    apikey: process.env.ETHERSCAN_API_KEY!,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode: sourceCodeData.SourceCode,
    codeformat: "solidity-single-file",
    contractname: sourceCodeData.ContractName,
    compilerversion: sourceCodeData.CompilerVersion,
    optimizationUsed: sourceCodeData.OptimizationUsed,
    runs: sourceCodeData.Runs,
    constructorArguements: constructorArguments,
  });

  const res = await fetch("https://api-sepolia.etherscan.io/api", {
    method: "post",
    body: parameters,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const json = await res.json();

  if (json.status !== "1") {
    throw new Error(
      `Failed to verify contract. status: ${json.status}, message: ${json.message}, result: ${json.result}`
    );
  }
}
