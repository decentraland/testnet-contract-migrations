import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class MarketplacePostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.Marketplace);
    const abi = getAbi(ContractName.Marketplace);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const initialize1Tx = await contract["initialize()"]();
    await initialize1Tx.wait();

    const manaAddress = getAddress(ContractName.MANAToken);
    const landAddress = getAddress(ContractName.LANDProxy);
    const owner = await signers[0].getAddress();

    const initialize2Tx = await contract["initialize(address,address,address)"](manaAddress, landAddress, owner);
    await initialize2Tx.wait();

    expect(await contract.acceptedToken()).to.equal(manaAddress);
    expect(await contract.legacyNFTAddress()).to.equal(landAddress);
    expect(await contract.owner()).to.equal(owner);
  }
}
