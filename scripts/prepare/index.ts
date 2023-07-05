import dotenv from "dotenv";
dotenv.config();

import { downloadSourceCodes } from "./downloadSourceCodes";
import { downloadCreationCode } from "./downloadCreationCode";

async function main() {
  await downloadSourceCodes();
  await downloadCreationCode();
}

main();
