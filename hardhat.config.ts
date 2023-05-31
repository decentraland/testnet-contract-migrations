import { HardhatUserConfig, task, types } from "hardhat/config";
import {
  TASK_FLATTEN,
  TASK_FLATTEN_GET_FLATTENED_SOURCE,
} from "hardhat/builtin-tasks/task-names";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import { writeFile } from "fs/promises";

dotenv.config();

task(
  TASK_FLATTEN,
  "Flattens and prints contracts and their dependencies. If no file is passed, all the contracts in the project will be flattened."
)
  .addOptionalParam("output", "Output file path", undefined, types.inputFile)
  .setAction(
    async (
      { files, output }: { files: string[] | undefined; output?: string },
      { run }
    ) => {
      const flattenContract = await run(TASK_FLATTEN_GET_FLATTENED_SOURCE, {
        files,
      });

      if (output) {
        await writeFile(output, flattenContract);
      } else {
        console.log(flattenContract);
      }
    }
  );

const config: HardhatUserConfig = {
  networks: {
    deploy: {
      url: process.env.VERIFYING_RPC_URL,
      timeout: 5 * 60 * 1000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [],
  },
};

export default config;
