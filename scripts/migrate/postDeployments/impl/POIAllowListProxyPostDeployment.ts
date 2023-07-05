import { ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { PostDeployment } from "../PostDeployment";

export class POIAllowListProxyPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = this.getAddress(ContractName.POIAllowListProxy);

    const abi = this.getAbi(ContractName.BaseList);

    const contract = new ethers.Contract(address, abi, signers[0]);

    const initializeTx = await contract.initialize("allowlist:poi", "POI", "COORDINATES");

    await initializeTx.wait();
  }
}
