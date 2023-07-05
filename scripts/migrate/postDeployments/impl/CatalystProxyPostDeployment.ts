import { ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class CatalystProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.CatalystProxy);

    const abi = getAbi(ContractName.Catalyst);

    const contract = new ethers.Contract(address, abi, signers[0]);

    const initializeTx = await contract.initialize();

    await initializeTx.wait();
  }
}
