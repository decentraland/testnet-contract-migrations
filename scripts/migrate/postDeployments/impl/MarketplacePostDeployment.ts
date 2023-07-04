import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class MarketplacePostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const marketplaceAddress = this.getAddress(ContractName.Marketplace);

    const marketplaceAbi = this.getAbi(ContractName.Marketplace);

    const initializer = signers[0];

    const initializerAddress = await initializer.getAddress();

    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceAbi, initializer);

    const initialize1Tx = await marketplace["initialize()"]();

    await initialize1Tx.wait();

    const manaTokenAddress = this.getAddress(ContractName.MANAToken);

    const landProxyAddress = this.getAddress(ContractName.LANDProxy);

    const initialize2Tx = await marketplace["initialize(address,address,address)"](
      manaTokenAddress,
      landProxyAddress,
      initializerAddress
    );

    await initialize2Tx.wait();

    const acceptedToken = await marketplace.acceptedToken();

    expect(acceptedToken).to.equal(manaTokenAddress);

    const legacyNFTAddress = await marketplace.legacyNFTAddress();

    expect(legacyNFTAddress).to.equal(landProxyAddress);

    const owner = await marketplace.owner();

    expect(owner).to.equal(initializerAddress);
  }
}
