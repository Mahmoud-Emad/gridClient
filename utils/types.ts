import { Deployment } from "../client";

export interface DeploymentOptions {
  version: number;
  twin_id: number;
  metadata: string;
  description: string;
  expiration: number;
  workloads: WorkloadData[];
  signatureRequirement: SignatureRequirementData
}

export interface GridSetOptions {
  deployment: Deployment;
}

export interface WorkloadData {
  version: number;
  name: string;
  type?: WorkloadTypes;
  data?: ZMountData | NetworkData | ZMachineData;
  metadata: string;
  description: string;
}

export interface NetworkData {
  subnet: string;
  ip_range: string;
  wireguard_private_key: string;
  wireguard_listen_port: number;
  peers: string[];
}

export interface ZMountData {
  size: number;
  mounts: DiskMountData[];
}

export interface DiskMountData {
  name: string;
  mountpoint: string;
}

export interface ComputeCapacityData {
  cpu: number;
  memory: number;
}

export interface GPUData {}

export interface ZMachineData {
  flist: string;
  network: NetworkData;
  size: number; // Root file system
  mounts: DiskMountData[];
  entrypoint: string;
  compute_capacity: ComputeCapacityData;
  env: object;
  corex: boolean;
  gpu: GPUData[];
}

export interface SignatureRequestData {
  twin_id: number;
  weight: number;
  required: boolean;
}

export interface SignatureRequirementData {
  weight_required: number;
  requests: SignatureRequestData[];
}

export enum WorkloadTypes {
  zmachine = "zmachine",
  zmount = "zmount",
  network = "network",
  ip = "ip",
}

export enum KeypairType {
  sr25519 = "sr25519",
  ed25519 = "ed25519",
}