import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class OwnableBatchVestingImplPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.OwnableBatchVestingImpl);
    const abi = getAbi(ContractName.OwnableBatchVestingImpl);
    const contract = new ethers.Contract(address, abi, signers[0]);
    const owner = await signers[0].getAddress();

    const initializeTx = await contract.initialize(owner);
    await initializeTx.wait();

    expect(await contract.owner()).to.equal(owner);
  }
}
