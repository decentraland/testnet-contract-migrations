import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class LANDProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const landProxyAddress = this.getAddress(ContractName.LANDProxy);

    const landProxyAbi = this.getAbi(ContractName.LANDProxy);

    const upgrader = signers[1];

    const landProxy = new ethers.Contract(landProxyAddress, landProxyAbi, upgrader);

    const landRegistryAddress = this.getAddress(ContractName.LANDRegistry);

    const upgradeTx = await landProxy.upgrade(landRegistryAddress, ethers.toUtf8Bytes("Nando"));

    await upgradeTx.wait();

    const currentContract = await landProxy.currentContract()

    expect(currentContract).to.equal(landRegistryAddress);

    const proxyOwner = await landProxy.proxyOwner()

    expect(proxyOwner).to.equal(await upgrader.getAddress());

    const landRegistryAbi = this.getAbi(ContractName.LANDRegistry);

    const otherAccount = signers[0];

    const landRegistry = new ethers.Contract(landProxyAddress, landRegistryAbi, otherAccount);

    const name = await landRegistry.name();

    expect(name).to.equal("Decentraland LAND");

    const symbol = await landRegistry.symbol();

    expect(symbol).to.equal("LAND");

    const description = await landRegistry.description();

    expect(description).to.equal("Contract that stores the Decentraland LAND registry");
  }
}
