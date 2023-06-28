import { ContractMethodArgs } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { deployedContractAddresses } from "../../config";
import { ContractName } from "../../../../common/types";

export class EstateProxyConstructorFactory implements ConstructorFactory {
  getConstructorArgs(): ContractMethodArgs<any[]> {
    const estateRegistryAddress = deployedContractAddresses.get(ContractName.EstateRegistry);

    if (!estateRegistryAddress) {
      throw new Error("Address not found");
    }

    return [estateRegistryAddress];
  }
}
