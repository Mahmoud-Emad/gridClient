import { ComputeCapacityData } from "./utils/types";
import {
  Deployment,
  GridClient,
  Network,
  Workload,
  WorkloadTypes,
  ZMount,
  ZMachine,
  SignatureRequest,
  SignatureRequirement,
  ComputeCapacity,
  DiskMount,
} from "./client";

async function main() {
  const grid = new GridClient();

  const mountDisk = new DiskMount({
    name: "disk1",
    mountpoint: "/mnt/data",
  });

  const zmount = new ZMount({
    size: 152154151,
    mounts: [mountDisk],
  });

  const znet = new Network({
    ip_range: "",
    peers: [],
    subnet: "",
    wireguard_listen_port: 5000,
    wireguard_private_key: "",
  });

  const computeCapacity = new ComputeCapacity({
    cpu: 1,
    memory: 2048,
  });

  const zmachine = new ZMachine({
    flist: "https://hub.grid.tf/tf-official-vms/ubuntu-20.04-lts.flist",
    compute_capacity: computeCapacity,
    corex: false,
    entrypoint: "/init.sh",
    env: {
      Key: "Value",
    },
    gpu: [],
    mounts: zmount.mounts,
    network: znet,
    size: 45411,
  });

  const workload = new Workload({
    description: "Some description",
    metadata: "",
    name: "",
    version: 0,
  });

  const signatureRequest = new SignatureRequest({
    required: false,
    twin_id: 143,
    weight: 1,
  });

  const signatureRequirement = new SignatureRequirement({
    requests: [signatureRequest],
    weight_required: 1,
  });

  // Set the network workload
  workload.set({
    description: "Setting network",
    metadata: "MetaData",
    name: "MyNet",
    version: 0,
    data: znet,
    type: WorkloadTypes.network,
  });

  // Set the zmount workload
  workload.set({
    description: "Setting zmount",
    metadata: "MetaData",
    name: "MyZmount",
    version: 0,
    data: zmount,
    type: WorkloadTypes.zmount,
  });

  // Set the zmachine workload
  workload.set({
    description: "Setting zmachine",
    metadata: "MetaData",
    name: "MyZmachine",
    version: 0,
    data: zmachine,
    type: WorkloadTypes.zmachine,
  });

  console.log("workloads", workload.all());

  const deployment = new Deployment({
    description: "Some description",
    expiration: 15,
    metadata: "",
    twin_id: 143,
    version: 0,
    workloads: workload.all(),
    signatureRequirement: signatureRequirement,
  });

  console.log("workloads", workload.allData());

  // await grid.connect()
  // await grid.deploy({ deployment: deployment });
}

main();
