import hre from "hardhat";

const TWO_MINUTES = 2 * 60 * 1000;

export const delay = (ms: number) => new Promise((_) => setTimeout(_, ms));

export const isErrorWithMessage = (error: unknown): error is Error =>
  !!error && typeof error === "object" && "message" in error;

export async function verifyContract(
  contractName: string,
  contractAddress: string,
  constructorArguments: any[] = []
) {
  console.log("Waiting for etherscan to index the contract...");

  while (true) {
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments,
      });
      console.log(`${contractName} verified`);
      break;
    } catch (error) {
      if (
        isErrorWithMessage(error) &&
        error.message.includes("Not connected to Ethereum network")
      ) {
        throw error;
      }

      console.error(
        `Failed to verify ${contractName}, maybe it's not yet indexed by Etherscan`,
        error
      );

      await delay(TWO_MINUTES);
    }
  }
}
