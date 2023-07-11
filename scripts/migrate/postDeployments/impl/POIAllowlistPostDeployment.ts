import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class POIAllowlistPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.POIAllowlist);
    const abi = getAbi(ContractName.POIAllowlist);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const name = "allowlist:poi";
    const symbol = "POI";
    const listType = "COORDINATES";

    const initializeTx = await contract.initialize(name, symbol, listType);
    await initializeTx.wait();

    expect(await contract.name()).to.be.equal(name);
    expect(await contract.symbol()).to.be.equal(symbol);
    expect(await contract.listType()).to.be.equal(listType);
  }
}
