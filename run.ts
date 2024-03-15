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

import * as dotenv from "dotenv";

dotenv.config(); // Load all env vars.

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
    subnet: "10.20.2.0/24",
    ip_range: "10.20.0.0/16",
    wireguard_private_key: process.env.wireguardPrivateKey,
    wireguard_listen_port: 18965,
    peers: [],
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
    signatures: []
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

  const deployment = new Deployment({
    description: "Some description",
    expiration: 15,
    metadata: "",
    twin_id: 143,
    version: 0,
    workloads: workload.all(),
    signature_requirement: signatureRequirement,
  });

  console.log("workloads", workload.allData());

  await grid.connect({
    chainURL: process.env.chainURL,
    relayURL: process.env.relayURL,
    mnemonic: process.env.mnemonic,
    twinId: +process.env.twinId
  })

  await grid.deploy({ deployment: deployment, nodeId: 11, twinId: +process.env.twinId, mnemonic: process.env.mnemonic });
}

main();
