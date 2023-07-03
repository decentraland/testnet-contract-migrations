import { ethers } from "ethers";
import { ContractName } from "../common/types";
import { ConstructorFactory } from "./constructors/ConstructorFactory";
import { EstateProxyConstructorFactory } from "./constructors/impl/EstateProxyConstructorFactory";
import { PostDeployment } from "./postDeployments/PostDeployment";
import { ChainId } from "./types";
import { loadOriginContractsData } from "./utils";
import { LANDProxyPostDeployment, LANDRegistryPostDeployment, MANATokenPostDeployment } from "./postDeployments/impl";

export const targetChainId: ChainId = (() => {
  const env = process.env.TARGET_CHAIN_ID;

  if (!env) {
    throw new Error("TARGET_CHAIN_ID env var not found");
  }

  const num = Number(env);

  if (!ChainId[num]) {
    throw new Error("Invalid TARGET_CHAIN_ID");
  }

  return num;
})();

export const deploymentOrder = [
  ContractName.MANAToken,
  ContractName.LANDRegistry,
  ContractName.LANDProxy,
  ContractName.EstateRegistry,
  ContractName.EstateProxy,
];

export const originContractsData = loadOriginContractsData(deploymentOrder);

export const deployedContractAddresses = new Map<ContractName, string>();

export const contractDeployers = new Map<ContractName, (signers: ethers.Signer[]) => ethers.Signer>();

export const constructorFactories = new Map<ContractName, ConstructorFactory>();

export const postDeployments = new Map<ContractName, PostDeployment>();

// Contract Deployers

contractDeployers.set(ContractName.MANAToken, pickSigner(0));
contractDeployers.set(ContractName.LANDRegistry, pickSigner(0));
contractDeployers.set(ContractName.LANDProxy, pickSigner(1));
contractDeployers.set(ContractName.EstateRegistry, pickSigner(0));
contractDeployers.set(ContractName.EstateProxy, pickSigner(1));

// Constructor Factories

constructorFactories.set(ContractName.EstateProxy, new EstateProxyConstructorFactory());

// Post Deployments

postDeployments.set(ContractName.MANAToken, new MANATokenPostDeployment());
postDeployments.set(ContractName.LANDRegistry, new LANDRegistryPostDeployment());
postDeployments.set(ContractName.LANDProxy, new LANDProxyPostDeployment());

// Utils

function pickSigner(index: number) {
  return (signers: ethers.Signer[]) => signers[index];
}
