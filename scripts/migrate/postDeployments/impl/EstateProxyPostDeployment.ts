import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class EstateProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    // Initialize

    const estateProxyAddress = this.getAddress(ContractName.EstateProxy);

    const estateRegistryAbi = this.getAbi(ContractName.EstateRegistry);

    const initializer = signers[0];

    const estateRegistry = new ethers.Contract(estateProxyAddress, estateRegistryAbi, initializer);

    const landProxyAddress = this.getAddress(ContractName.LANDProxy);

    const initializeTx = await estateRegistry["initialize(string,string,address)"](
      "Estate Impl",
      "EST",
      landProxyAddress
    );

    await initializeTx.wait();

    const name = await estateRegistry.name();

    expect(name).to.equal("Estate Impl");

    const symbol = await estateRegistry.symbol();

    expect(symbol).to.equal("EST");

    const description = await estateRegistry.registry();

    expect(description).to.equal(landProxyAddress);

    const owner = await estateRegistry.owner();

    expect(owner).to.equal(await initializer.getAddress());

    // Set Estate Registry on Land Registry

    const proxyOwner = signers[1];

    const landRegistryAbi = this.getAbi(ContractName.LANDRegistry);

    const landRegistry = new ethers.Contract(landProxyAddress, landRegistryAbi, proxyOwner);

    const setEstateRegistryTx = await landRegistry.setEstateRegistry(estateProxyAddress);

    await setEstateRegistryTx.wait();

    const estateRegistryAddress = await landRegistry.estateRegistry();

    expect(estateRegistryAddress).to.equal(estateProxyAddress);
  }
}
