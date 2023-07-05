import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class ERC721BidPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.ERC721Bid);
    const abi = getAbi(ContractName.ERC721Bid);
    const contract = new ethers.Contract(address, abi, signers[0]);

    expect(await contract.owner()).to.equal(await signers[0].getAddress());
    expect(await contract.manaToken()).to.equal(getAddress(ContractName.MANAToken));
  }
}
