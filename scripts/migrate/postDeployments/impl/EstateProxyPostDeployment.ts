import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class EstateProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    // Initialize

    const address = getAddress(ContractName.EstateProxy);
    const abi = getAbi(ContractName.EstateRegistry);
    const contract = new ethers.Contract(address, abi, signers[0]);
    const landAddress = getAddress(ContractName.LANDProxy);

    const initialize1Tx = await contract["initialize(string,string,address)"]("Estate Impl", "EST", landAddress);
    await initialize1Tx.wait();

    const initialize2Tx = await contract["initialize()"]();
    await initialize2Tx.wait();

    expect(await contract.name()).to.equal("Estate Impl");
    expect(await contract.symbol()).to.equal("EST");
    expect(await contract.registry()).to.equal(landAddress);
    expect(await contract.owner()).to.equal(await signers[0].getAddress());

    // Set Estate Registry on Land Registry

    const landAbi = getAbi(ContractName.LANDRegistry);
    const landContract = new ethers.Contract(landAddress, landAbi, signers[1]);

    const setEstateRegistryTx = await landContract.setEstateRegistry(address);
    await setEstateRegistryTx.wait();
    
    expect(await landContract.estateRegistry()).to.equal(address);
  }
}
