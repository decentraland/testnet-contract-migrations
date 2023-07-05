import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class ExclusiveMasksCollectionPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.ExclusiveMasksCollection);

    const abi = getAbi(ContractName.ExclusiveMasksCollection);

    const contract = new ethers.Contract(address, abi, signers[0]);

    expect(await contract.name()).to.equal("dcl://exclusive_masks");

    expect(await contract.symbol()).to.equal("DCLEXCLSVMSKS");

    expect(await contract.allowed(await signers[0].getAddress())).to.be.true;

    expect(await contract.baseURI()).to.equal(
      "https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/exclusive_masks/wearables/"
    );
  }
}
