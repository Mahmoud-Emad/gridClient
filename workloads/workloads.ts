import { ComputeCapacityData } from "../models/capacity";
import { DiskMountData, ZMountWorkload } from "../models/disks";
import { NetworkWorkload } from "../models/networks";
import {
  WorkloadData,
  WorkloadTypes,
  GPUData,
} from "../utils/types";

class Workload implements WorkloadData {
  private meta: WorkloadData;
  version: number;
  name: string;
  type?: WorkloadTypes;
  // data: ZMountWorkload | NetworkWorkload | ZMachine;
  metadata: string;
  description: string;
  private __workloads: Workload[] = [];
  private __allData: WorkloadData[] = [];

  constructor(meta: WorkloadData) {
    this.meta = meta;
    this.version = meta.version;
    this.name = meta.name;
    this.type = meta.type;
    // this.data = meta.data;
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
      // data: meta.data,
    });

    this.__workloads.push(workload);
    this.__allData.push(workload.meta);
    return this.__workloads;
  }

  challenge(): string {
    return `${this.version}${this.metadata}${this.description}`;
  }
}

class DiskMount implements DiskMountData {
  private meta: DiskMountData;
  name: string;
  mountpoint: string;

  constructor(meta: DiskMountData) {
    this.name = meta.name;
    this.mountpoint = meta.mountpoint;
  }

  getData(): DiskMountData {
    return this.meta;
  }

  challenge() {
    let out = "";
    out += this.name;
    out += this.mountpoint;
    return out
  }
}

export { Workload, DiskMount, };
