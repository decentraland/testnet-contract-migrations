import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class VestingImplPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.VestingImpl);
    const abi = getAbi(ContractName.VestingImpl);
    const contract = new ethers.Contract(address, abi, signers[0]);
    const owner = await signers[0].getAddress();
    const manaAddress = getAddress(ContractName.MANAToken);

    const initializeTx = await contract.initialize(owner, owner, "1", "1", "1", false, manaAddress);
    await initializeTx.wait();

    expect(await contract.owner()).to.equal(owner);
    expect(await contract.beneficiary()).to.equal(owner);
    expect(await contract.start()).to.equal(1n);
    expect(await contract.cliff()).to.equal(2n);
    expect(await contract.duration()).to.equal(1n);
    expect(await contract.revocable()).to.equal(false);
    expect(await contract.token()).to.equal(manaAddress);
  }
}
