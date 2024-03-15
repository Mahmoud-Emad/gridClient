import {
  Deployment,
  Network,
  SignatureRequirement,
  Workload,
  ZMachine,
  ZMount,
  ComputeCapacity,
  DiskMount,
  Contract,
} from "../client";
import { Signature } from "../workloads/deployment";

interface DeploymentOptions {
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

interface WorkloadData {
  version: number;
  name: string;
  type?: WorkloadTypes;
  data?: ZMount | Network | ZMachine;
  metadata: string;
  description: string;
}

interface NetworkData {
  subnet: string;
  ip_range: string;
  wireguard_private_key: string;
  wireguard_listen_port: number;
  peers: string[];
}

interface ZMountData {
  size: number;
  mounts: DiskMount[];
}

interface DiskMountData {
  name: string;
  mountpoint: string;
}

interface ComputeCapacityData {
  cpu: number;
  memory: number;
}

interface GPUData {}

interface ZMachineData {
  flist: string;
  network: Network;
  size: number; // Root file system
  mounts: DiskMount[];
  entrypoint: string;
  compute_capacity: ComputeCapacity;
  env: object;
  corex: boolean;
  gpu: GPUData[];
}

interface SignatureRequestData {
  twin_id: number;
  weight: number;
  required: boolean;
}

interface SignatureRequirementData {
  weight_required: number;
  requests: SignatureRequestData[];
  signatures: Signature[];
}

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
  SignatureRequirementData,
  SignatureRequestData,
  ZMachineData,
  GPUData,
  ComputeCapacityData,
  DiskMountData,
  ZMountData,
  GridSetOptions,
  NetworkData,
  WorkloadData,
  ClientOptions,
  DeploymentOptions
}