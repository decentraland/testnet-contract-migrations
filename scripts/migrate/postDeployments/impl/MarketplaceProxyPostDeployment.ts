import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class MarketplaceProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const marketplaceProxyAddress = this.getAddress(ContractName.MarketplaceProxy);

    const marketplaceAbi = this.getAbi(ContractName.Marketplace);

    const initializer = signers[0];

    const initializerAddress = await initializer.getAddress();

    const marketplace = new ethers.Contract(marketplaceProxyAddress, marketplaceAbi, initializer);

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

    expect(await marketplace.acceptedToken()).to.equal(manaTokenAddress);

    expect(await marketplace.legacyNFTAddress()).to.equal(landProxyAddress);

    expect(await marketplace.owner()).to.equal(initializerAddress);

    const marketplaceProxyAbi = this.getAbi(ContractName.MarketplaceProxy);

    const deployer = signers[1];

    const deployerAddress = await deployer.getAddress();

    const marketplaceProxy = new ethers.Contract(marketplaceProxyAddress, marketplaceProxyAbi, deployer);

    expect(await marketplaceProxy.admin()).to.equal(deployerAddress);
  }
}
