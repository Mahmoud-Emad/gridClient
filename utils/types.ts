import {
  Deployment,
  SignatureRequirement,
  Workload,
  Contract,
} from "../client";

interface DeploymentOptions {
  name: string;
  version: number;
  twin_id: number;
  metadata: string;
  description: string;
  expiration: number;
  workloads: Workload[];
  signature_requirement: SignatureRequirement;
  contract_id?: number;
  contract?: Contract;
}

interface GridSetOptions {
  deployment: Deployment;
  nodeId: number;
  twinId: number;
  mnemonic: string;
}

interface GPUData {}


enum WorkloadTypes {
  zmachine = "zmachine",
  zmount = "zmount",
  network = "network",
  ip = "ip",
}

enum KeypairType {
  sr25519 = "sr25519",
  ed25519 = "ed25519",
}

interface ClientOptions {
  chainURL: string;
  relayURL: string;
  mnemonic: string;
  twinId: number;
}

export {
  Contract,
  KeypairType,
  WorkloadTypes,
  GPUData,
  GridSetOptions,
  ClientOptions,
  DeploymentOptions,
};
