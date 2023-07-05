import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class RentalsProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.RentalsProxy;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const iface = new ethers.Interface(this.getAbi(ContractName.RentalsImplementation));

    const owner = await signers[0].getAddress();

    const data = iface.encodeFunctionData("initialize", [
      owner,
      this.getAddress(ContractName.MANAToken),
      owner,
      "25000",
    ]);

    return [this.getAddress(ContractName.RentalsImplementation), this.getAddress(ContractName.RentalsProxyAdmin), data];
  }
}
