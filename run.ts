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
} from "./client";

async function main() {
  const grid = new GridClient();

  const zmount = new ZMount({
    size: 152154151,
    mounts: [
      {
        name: "disk1",
        mountpoint: "/mnt/data",
      },
    ],
  });

  const znet = new Network({
    ip_range: "",
    peers: [],
    subnet: "",
    wireguard_listen_port: 5000,
    wireguard_private_key: "",
  });

  const computeCapacity: ComputeCapacityData = {
    cpu: 1,
    memory: 2048,
  };

  const zmachine = new ZMachine({
    flist: "https://hub.grid.tf/tf-official-vms/ubuntu-20.04-lts.flist",
    compute_capacity: computeCapacity,
    corex: false,
    entrypoint: "/init.sh",
    env: {
      Key: "Value",
    },
    gpu: [],
    mounts: zmount.meta.mounts,
    network: znet.meta,
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
    weight: 1
  })

  const signatureRequirement = new SignatureRequirement({
    requests: [signatureRequest],
    weight_required: 1
  })

  // Set the network workload
  workload.set(WorkloadTypes.network, znet.meta)
  // Set the network workload
  workload.set(WorkloadTypes.zmount, zmount.meta)
  // Set the zmachine workload
  workload.set(WorkloadTypes.zmachine, zmachine.meta)

  const deployment = new Deployment({
    description: "Some description",
    expiration: 15,
    metadata: "",
    twin_id: 143,
    version: 0,
    workloads: workload.getAllWorkloads(),
    signatureRequirement: signatureRequirement,
  });

  await grid.connect()
  await grid.deploy({ deployment: deployment });
}

main();
