import { ethers } from "ethers";

export abstract class PostDeployment {
  abstract exec(signers: ethers.Signer[]): Promise<void>;
}
