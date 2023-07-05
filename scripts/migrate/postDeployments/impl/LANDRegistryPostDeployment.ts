import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class LANDRegistryPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.LANDRegistry);
    const abi = getAbi(ContractName.LANDRegistry);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const initializeTx = await contract.initialize(ethers.toUtf8Bytes("Nando"));
    await initializeTx.wait();

    expect(await contract.name()).to.equal("Decentraland LAND");
    expect(await contract.symbol()).to.equal("LAND");
    expect(await contract.description()).to.equal("Contract that stores the Decentraland LAND registry");
  }
}
