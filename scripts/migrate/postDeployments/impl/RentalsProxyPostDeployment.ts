import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class RentalsProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = this.getAddress(ContractName.RentalsProxy);

    const abi = this.getAbi(ContractName.RentalsImplementation);

    const contract = new ethers.Contract(address, abi, signers[0]);

    const owner = await signers[0].getAddress();

    expect(await contract.owner()).to.equal(owner);
    expect(await contract.getFeeCollector()).to.equal(owner);
    expect(await contract.getToken()).to.equal(this.getAddress(ContractName.MANAToken));
    expect(await contract.getFee()).to.equal(25000n);
  }
}
