import dotenv from "dotenv";
import { downloadCreationData } from "./downloadCreationData";
import { downloadCreationTransactions } from "./downloadCreationTransactions";
import { downloadSourceCodes } from "./downloadSourceCodes";
import { downloadCreationCode } from "./downloadCreationCode";

async function main() {
  dotenv.config();

  await downloadCreationCode();
  await downloadCreationData();
  await downloadCreationTransactions();
  await downloadSourceCodes();
}

main();
