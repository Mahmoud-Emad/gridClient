import {
  WorkloadData,
  WorkloadTypes,
  ZMountData,
  NetworkData,
  ZMachineData,
} from "../utils/types";

class Workload {
  meta: WorkloadData;
  workloads: WorkloadData[];

  constructor(meta?: WorkloadData) {
    this.meta = meta ? meta : this.init();
    this.workloads = [];
    this.workloads.push(this.meta);
  }

  private init(): WorkloadData {
    return {
      description: "",
      metadata: "",
      name: "",
      type: WorkloadTypes.zmachine,
      version: 0,
    };
  }

  set(
    type: WorkloadTypes,
    data: ZMountData | NetworkData | ZMachineData,
    meta?: WorkloadData
  ): WorkloadData[] {
    this.meta = meta ? meta : this.init();
    this.meta.type = type;
    this.meta.data = data;
    this.workloads.push(this.meta);
    return this.workloads;
  }

  allData(): (ZMountData | NetworkData | ZMachineData)[] {
    const workloadsData: Array<ZMountData | NetworkData | ZMachineData> = [];
    this.workloads.forEach((workload) => {
      if (workload.data) {
        workloadsData.push(workload.data);
      }
    });
    return workloadsData;
  }

  getAllWorkloads(): WorkloadData[] {
    return this.workloads;
  }

  getCurrentWorkload(): WorkloadData {
    return this.meta;
  }

  getWorkloadByType(type: WorkloadTypes): WorkloadData {
    return (
      this.workloads.filter((workload) => workload.type === type)[0] ||
      undefined
    );
  }
}

class ZMount {
  meta: ZMountData;
  constructor(meta: ZMountData) {
    this.meta = meta;
  }
}

class Network {
  meta: NetworkData;
  constructor(meta: NetworkData) {
    this.meta = meta;
  }
}

class ZMachine {
  meta: ZMachineData;
  constructor(meta: ZMachineData) {
    this.meta = meta;
  }
}

export { Workload, ZMount, Network, ZMachine };
