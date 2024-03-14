import {
  WorkloadData,
  WorkloadTypes,
  ZMountData,
  NetworkData,
  ZMachineData,
  DiskMountData,
  GPUData,
  ComputeCapacityData,
} from "../utils/types";

class Workload implements WorkloadData {
  private meta: WorkloadData;
  version: number;
  name: string;
  type?: WorkloadTypes;
  data?: ZMount | Network | ZMachine;
  metadata: string;
  description: string;
  private __workloads: Workload[] = [];
  private __allData: WorkloadData[] = [];

  constructor(meta: WorkloadData) {
    this.meta = meta;
    this.version = meta.version;
    this.name = meta.name;
    this.type = meta.type;
    this.data = meta.data;
    this.metadata = meta.metadata;
    this.description = meta.description;
  }

  all(): Workload[] {
    return this.__workloads;
  }

  allData(): WorkloadData[] {
    return this.__allData;
  }

  set(meta: WorkloadData): Workload[] {
    const workload = new Workload({
      description: meta.description,
      metadata: meta.metadata,
      name: meta.name,
      version: meta.version,
      type: meta.type,
      data: meta.data,
    });

    this.__workloads.push(workload);
    this.__allData.push(workload.meta);
    return this.__workloads;
  }

  challenge(): string {
    return `${this.version}${this.metadata}${this.description}`;
  }
}

class ZMount implements ZMountData {
  size: number;
  mounts: DiskMount[];
  private meta: ZMountData;

  constructor(meta: ZMountData) {
    this.meta = meta;
    this.size = meta.size;
    this.mounts = meta.mounts;
  }

  getData(): ZMountData {
    return this.meta;
  }

  challenge() {}
}

class Network implements NetworkData {
  private meta: NetworkData;
  subnet: string;
  ip_range: string;
  wireguard_private_key: string;
  wireguard_listen_port: number;
  peers: string[];

  constructor(meta: NetworkData) {
    this.meta = meta;
    this.subnet = meta.subnet;
    this.ip_range = meta.ip_range;
    this.wireguard_listen_port = meta.wireguard_listen_port;
    this.wireguard_private_key = meta.wireguard_private_key;
    this.peers = meta.peers;
  }

  getData(): NetworkData {
    return this.meta;
  }
  challenge() {}
}

class ComputeCapacity implements ComputeCapacityData {
  private meta: ComputeCapacityData;
  cpu: number;
  memory: number;

  constructor(meta: ComputeCapacityData) {
    this.cpu = meta.cpu;
    this.memory = meta.memory;
  }

  getData(): ComputeCapacityData {
    return this.meta;
  }

  challenge() {}
}

class DiskMount implements DiskMountData {
  private meta: DiskMountData;
  name: string;
  mountpoint: string;

  constructor(meta: DiskMountData) {
    this.name = meta.name
    this.mountpoint = meta.mountpoint
  }

  getData(): DiskMountData {
    return this.meta;
  }

  challenge() {}
}

class ZMachine implements ZMachineData {
  private meta: ZMachineData;
  flist: string;
  network: Network;
  size: number;
  mounts: DiskMount[];
  entrypoint: string;
  compute_capacity: ComputeCapacity;
  env: object;
  corex: boolean;
  gpu: GPUData[];

  constructor(meta: ZMachineData) {
    this.meta = meta;
    this.flist = meta.flist;
    this.network = meta.network;
    this.size = meta.size;
    this.mounts = meta.mounts;
    this.entrypoint = meta.entrypoint;
    this.compute_capacity = meta.compute_capacity;
    this.env = meta.env;
    this.corex = meta.corex;
    this.gpu = meta.gpu;
  }

  getData(): ZMachineData {
    return this.meta;
  }
  challenge() {
    let out = "";
    out += `${this.flist}`;
    out += `${this.network.challenge()}`;
    out += `${this.size}`;
    out += `${this.compute_capacity.challenge()}`;

    for (let i = 0; i < this.mounts.length; i++) {
      out += this.mounts[i].challenge()
    }

    return out;
  }
}

export { Workload, ZMount, Network, ZMachine, ComputeCapacity, DiskMount};
