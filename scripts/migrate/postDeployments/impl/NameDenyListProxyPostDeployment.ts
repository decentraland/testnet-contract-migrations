import { ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class NameDenyListProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.NameDenyListProxy);
    const abi = getAbi(ContractName.BaseList);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const initializeTx = await contract.initialize("denylist:name", "DENYLIST_NAMES", "NAME");
    await initializeTx.wait();
  }
}
