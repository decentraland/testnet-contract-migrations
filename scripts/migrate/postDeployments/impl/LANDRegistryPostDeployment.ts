import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class LANDRegistryPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const landRegistryAddress = getAddress(ContractName.LANDRegistry);

    const landRegistryAbi = getAbi(ContractName.LANDRegistry);

    const initializer = signers[0];

    const landRegistry = new ethers.Contract(landRegistryAddress, landRegistryAbi, initializer);

    const initializeTx = await landRegistry.initialize(ethers.toUtf8Bytes("Nando"));

    await initializeTx.wait();

    const name = await landRegistry.name();

    expect(name).to.equal("Decentraland LAND");

    const symbol = await landRegistry.symbol();

    expect(symbol).to.equal("LAND");

    const description = await landRegistry.description();

    expect(description).to.equal("Contract that stores the Decentraland LAND registry");
  }
}
