import { GPUData } from "../utils/types";
import { ComputeCapacityData, ComputeCapacityWorkload } from "./capacity";
import { DiskMountData } from "./disks";
import { NetworkWorkload, ZMachineNetworkData, ZMachineNetworkModel } from "./networks";

interface ZMachineData {
  flist: string;
  network: ZMachineNetworkData;
  size: number; // Root file system
  mounts: DiskMountData[];
  entrypoint: string;
  compute_capacity: ComputeCapacityData;
  env: object;
  corex: boolean;
  gpu: GPUData[];
}

class ZMachineModel implements ZMachineData {
  protected data: ZMachineData;
  flist: string;
  network: ZMachineNetworkData;
  size: number;
  mounts: DiskMountData[];
  entrypoint: string;
  compute_capacity: ComputeCapacityData;
  env: object;
  corex: boolean;
  gpu: GPUData[];

  constructor(data: ZMachineData){
    this.data = data;
    this.flist = this.data.flist;
    this.network = this.data.network;
    this.size = this.data.size;
    this.mounts = this.data.mounts;
    this.entrypoint = this.data.entrypoint;
    this.env = this.data.env;
    this.compute_capacity = this.data.compute_capacity;
    this.corex = this.data.corex;
    this.gpu = this.data.gpu;
  }

  getData(): ZMachineData{
    return this.data;
  }
}

class ZMachineWorkload extends ZMachineModel {
  challenge() {
    // const network = new NetworkWorkload({
    //   ip_range: this.
    // })
    // let out = "";
    // out += `${this.flist}`;
    // out += `${this.network.challenge()}`;
    // out += `${this.size || "0"}`;
    // out += `${this.compute_capacity.challenge()}`;

    // for (let i = 0; i < this.mounts.length; i++) {
    //   out += this.mounts[i].challenge();
    // }

    // out += this.entrypoint;

    // for (const key of Object.keys(this.env).sort()) {
    //   out += key;
    //   out += "=";
    //   out += this.env[key];
    //   if (this.gpu) {
    //     for (const __gpu of this.gpu) {
    //       out += __gpu;
    //     }
    //   }
    // }

    // return out;
  }
}


export { 
  ZMachineModel,
  ZMachineWorkload,
  ZMachineData,
}