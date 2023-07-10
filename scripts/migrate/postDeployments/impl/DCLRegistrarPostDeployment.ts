import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class DCLRegistrarPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.DCLRegistrar);
    const abi = getAbi(ContractName.DCLRegistrar);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const migrationFinishedTx = await contract.migrationFinished();
    await migrationFinishedTx.wait();
  }
}
