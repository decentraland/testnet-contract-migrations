import { ethers } from "ethers";
import { ChainId, ContractName } from "../common/types";
import { loadOriginContractsData } from "./loadOriginContractsData";
import { ConstructorFactory } from "./constructors/ConstructorFactory";
import { EstateProxyConstructorFactory } from "./constructors/impl/EstateProxyConstructorFactory";
import { PostDeployment } from "./postDeployments/PostDeployment";
import { MANATokenPostDeployment } from "./postDeployments/impl/MANATokenPostDeployment";

export const targetChainId: ChainId = ChainId.GANACHE;

export const deploymentOrder = [
  ContractName.MANAToken,
  ContractName.LANDRegistry,
  ContractName.LANDProxy,
  ContractName.EstateRegistry,
  ContractName.EstateProxy,
];

export const originContractsData = loadOriginContractsData();

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

// Utils

function pickSigner(index: number) {
  return (signers: ethers.Signer[]) => signers[index];
}
