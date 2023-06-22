import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { contracts } from "./contracts";
import { outputPath } from "./paths";

export async function getFromEtherscan(
  makeUrl: (address: string) => string,
  ___filename: string,
  mapResult: (result: any) => any
) {
  const scriptOutputPath = path.join(outputPath, path.basename(___filename, ".ts"));

  fs.rmSync(scriptOutputPath, { recursive: true, force: true });

  fs.mkdirSync(scriptOutputPath, { recursive: true });

  for (const [name, address] of Object.entries(contracts)) {
    const response = await fetch(makeUrl(address));

    const { status, result, message } = await response.json();

    if (status !== "1") {
      throw new Error(`Invalid status: ${status}. Message: ${message}`);
    }

    fs.writeFileSync(path.join(scriptOutputPath, `${name}.json`), JSON.stringify(mapResult(result), null, 2));
  }
}
