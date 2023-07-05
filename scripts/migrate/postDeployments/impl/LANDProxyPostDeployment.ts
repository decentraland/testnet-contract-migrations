import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class LANDProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.LANDProxy);
    const abi = getAbi(ContractName.LANDProxy);
    const contract = new ethers.Contract(address, abi, signers[1]);
    const landAddress = getAddress(ContractName.LANDRegistry);

    const upgradeTx = await contract.upgrade(landAddress, ethers.toUtf8Bytes("Nando"));
    await upgradeTx.wait();

    expect(await contract.currentContract()).to.equal(landAddress);
    expect(await contract.proxyOwner()).to.equal(await signers[1].getAddress());

    const landAbi = getAbi(ContractName.LANDRegistry);
    const landContract = new ethers.Contract(address, landAbi, signers[0]);

    expect(await landContract.name()).to.equal("Decentraland LAND");
    expect(await landContract.symbol()).to.equal("LAND");
    expect(await landContract.description()).to.equal("Contract that stores the Decentraland LAND registry");
  }
}
