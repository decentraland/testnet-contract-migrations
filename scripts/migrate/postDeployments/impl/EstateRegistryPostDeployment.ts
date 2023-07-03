import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class EstateRegistryPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const estateRegistryAddress = this.getAddress(ContractName.EstateRegistry);

    const estateRegistryAbi = this.getAbi(ContractName.EstateRegistry);

    const initializer = signers[0];

    const estateRegistry = new ethers.Contract(estateRegistryAddress, estateRegistryAbi, initializer);

    const landProxyAddress = this.getAddress(ContractName.LANDProxy);

    const initializeTx = await estateRegistry['initialize(string,string,address)']("Estate Impl", "EST", landProxyAddress);

    await initializeTx.wait();

    const name = await estateRegistry.name();

    expect(name).to.equal("Estate Impl");

    const symbol = await estateRegistry.symbol();

    expect(symbol).to.equal("EST");

    const description = await estateRegistry.registry();

    expect(description).to.equal(landProxyAddress);
  }
}
