import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class ERC721BidPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = this.getAddress(ContractName.ERC721Bid);

    const abi = this.getAbi(ContractName.ERC721Bid);

    const contract = new ethers.Contract(address, abi, signers[0]);

    expect(await contract.owner()).to.equal(await signers[0].getAddress());

    expect(await contract.manaToken()).to.equal(this.getAddress(ContractName.MANAToken));
  }
}
