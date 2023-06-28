import { ChainId, ContractName } from "../../common/types";
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

export const constructorFactories = new Map<ContractName, ConstructorFactory>();

export const postDeployments = new Map<ContractName, PostDeployment>();

constructorFactories.set(ContractName.EstateProxy, new EstateProxyConstructorFactory());

postDeployments.set(ContractName.MANAToken, new MANATokenPostDeployment());
