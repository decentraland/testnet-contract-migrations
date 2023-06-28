import dotenv from "dotenv";
import fs from "fs";
import { outputDir } from "../../src/paths";
import { downloadCreationData } from "./downloadCreationData";
import { downloadCreationTransactions } from "./downloadCreationTransactions";
import { downloadSourceCodes } from "./downloadSourceCodes";
import { downloadCreationCode } from "./downloadCreationCode";

async function main() {
  dotenv.config();

  fs.rmSync(outputDir, { recursive: true, force: true });

  await downloadCreationData();
  await downloadSourceCodes();
  await downloadCreationTransactions();
  await downloadCreationCode();
}

main();
