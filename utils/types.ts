import { Deployment, Network, SignatureRequirement, Workload, ZMachine, ZMount, ComputeCapacity, DiskMount } from "../client";

export interface DeploymentOptions {
  version: number;
  twin_id: number;
  metadata: string;
  description: string;
  expiration: number;
  workloads: Workload[];
  signatureRequirement: SignatureRequirement
}

export interface GridSetOptions {
  deployment: Deployment;
}

export interface WorkloadData {
  version: number;
  name: string;
  type?: WorkloadTypes;
  data?: ZMount | Network | ZMachine;
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
  mounts: DiskMount[];
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
  network: Network;
  size: number; // Root file system
  mounts: DiskMount[];
  entrypoint: string;
  compute_capacity: ComputeCapacity;
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