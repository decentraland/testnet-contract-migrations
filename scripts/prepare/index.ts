import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { prepareDownloadsDir } from "../../common/paths";
import { downloadSourceCodes } from "./downloadSourceCodes";
import { downloadCreationCode } from "./downloadCreationCode";

async function main() {
  fs.rmSync(prepareDownloadsDir, { recursive: true, force: true });

  await downloadSourceCodes();
  await downloadCreationCode();
}

main();
