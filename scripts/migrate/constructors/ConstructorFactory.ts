import { ethers } from "ethers";

export interface ConstructorFactory {
  getConstructorArgs(): ethers.ContractMethodArgs<any[]>;
}
