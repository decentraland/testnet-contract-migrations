import dotenv from "dotenv";
import { downloadCreation } from "./downloadCreation";
import { downloadCreationTransactions } from "./downloadCreationTransactions";
import { downloadSourceCodes } from "./downloadSourceCodes";
import { downloadCreationCode } from "./downloadCreationCode";

async function main() {
  dotenv.config();

  await downloadCreationCode();
  await downloadCreation();
  await downloadCreationTransactions();
  await downloadSourceCodes();
}

main();
