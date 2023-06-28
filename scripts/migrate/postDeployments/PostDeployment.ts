import { ethers } from "ethers";

export interface PostDeployment {
  exec(signers: ethers.Signer[]): Promise<void>;
}
