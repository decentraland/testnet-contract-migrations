import fs from "fs";
import { ethers } from "ethers";
import { contractAddressesMap } from "../../src/config";
import { creationDataDir, creationTransactionsDir } from "../../src/paths";
import { ContractName } from "../../src/types";

export async function downloadCreationTransactions() {
  fs.rmSync(creationTransactionsDir, { recursive: true, force: true });

  for (const [name] of contractAddressesMap) {
    console.log("Downloading creation transaction data for", ContractName[name]);

    const { txHash } = JSON.parse(fs.readFileSync(`${creationDataDir}/${ContractName[name]}.json`, "utf-8"));

    const provider = ethers.getDefaultProvider(1);

    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    const transaction = await receipt.getTransaction();

    fs.mkdirSync(creationTransactionsDir, { recursive: true });

    fs.writeFileSync(
      `${creationTransactionsDir}/${ContractName[name]}.json`,
      JSON.stringify({ receipt, transaction }, null, 2)
    );
  }
}
