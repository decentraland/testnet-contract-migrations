import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class NAMEDenylistPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.NAMEDenylist);
    const abi = getAbi(ContractName.NAMEDenylist);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const name = "denylist:name";
    const symbol = "DENYLIST_NAMES";
    const listType = "NAME";

    const initializeTx = await contract.initialize(name, symbol, listType);
    await initializeTx.wait();

    expect(await contract.name()).to.be.equal(name);
    expect(await contract.symbol()).to.be.equal(symbol);
    expect(await contract.listType()).to.be.equal(listType);
  }
}
