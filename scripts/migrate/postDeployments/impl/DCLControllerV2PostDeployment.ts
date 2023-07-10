import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class DCLControllerV2PostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.DCLControllerV2);
    const registrarAddress = getAddress(ContractName.DCLRegistrar);
    const registrarAbi = getAbi(ContractName.DCLRegistrar);
    const registrarContract = new ethers.Contract(registrarAddress, registrarAbi, signers[0]);

    const addControllerTx = await registrarContract.addController(address);
    await addControllerTx.wait();

    expect(await registrarContract.controllers(address)).to.equal(true);
  }
}
