import { ZMountData } from "../models/disks";
import { ZMachineData } from "../models/machines";
import { NetworkData } from "../models/networks";
import {
  WorkloadTypes,
} from "../utils/types";

interface WorkloadData {
  version: number;
  name: string;
  type?: WorkloadTypes;
  data?: ZMountData | NetworkData | ZMachineData;
  metadata: string;
  description: string;
}

class Workload implements WorkloadData {
  private meta: WorkloadData;
  version: number;
  name: string;
  type?: WorkloadTypes;
  data: ZMountData | NetworkData | ZMachineData;
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

// class DiskMount implements DiskMountData {
//   private meta: DiskMountData;
//   name: string;
//   mountpoint: string;

//   constructor(meta: DiskMountData) {
//     this.name = meta.name;
//     this.mountpoint = meta.mountpoint;
//   }

//   getData(): DiskMountData {
//     return this.meta;
//   }

//   challenge() {
//     let out = "";
//     out += this.name;
//     out += this.mountpoint;
//     return out
//   }
// }

export { Workload, WorkloadData };
