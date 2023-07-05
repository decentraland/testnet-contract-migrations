import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class EstateRegistryPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.EstateRegistry);
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
  }
}
