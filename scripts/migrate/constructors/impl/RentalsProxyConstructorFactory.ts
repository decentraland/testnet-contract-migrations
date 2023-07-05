import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class RentalsProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.RentalsProxy;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const iface = new ethers.Interface(getAbi(ContractName.RentalsImplementation));

    const owner = await signers[0].getAddress();

    const data = iface.encodeFunctionData("initialize", [owner, getAddress(ContractName.MANAToken), owner, "25000"]);

    return [getAddress(ContractName.RentalsImplementation), getAddress(ContractName.RentalsProxyAdmin), data];
  }
}
