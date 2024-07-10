import { Deployment, GridClient, SignatureRequest, SignatureRequirement, Workload, WorkloadTypes } from "./client";

import * as dotenv from "dotenv";
import { DiskMountModel, ZMountWorkload } from "./models/disks";
import { ZMachineModel } from "./models/machines";
import { ComputeCapacityModel } from "./models/capacity";
import { ZMachineNetworkModel } from "./models/networks";

dotenv.config(); // Load all env vars.

async function main() {
  const grid = new GridClient();
  const computeCapacity = new ComputeCapacityModel({ cpu: 1, memory: 1024 });
  const mountDisk = new DiskMountModel({
    name: "disk1",
    mountpoint: "/mnt/data",
  });

  const zmountWorkload = new ZMountWorkload({
    size: 152154151,
    mounts: [mountDisk.getData(),],
  });

  const machineNetwork = new ZMachineNetworkModel({
    interfaces: [
      {
        ip: "10.20.2.2",
        network: "MachineNetwork",
        planetary: true,
        public_ip: "",
      },
    ],
  });

  const zmachine = new ZMachineModel({
    flist: "https://hub.grid.tf/tf-official-vms/ubuntu-20.04-lts.flist",
    compute_capacity: computeCapacity.getData(),
    corex: false,
    entrypoint: "/init.sh",
    env: {
      Key: "Value",
    },
    gpu: [],
    mounts: zmountWorkload.mounts,
    network: machineNetwork.getData(),
    size: 45411,
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

  const workload = new Workload({
    description: "Some description",
    metadata: "",
    name: "",
    version: 0,
  });

  workload.set({
    description: "Setting zmachine",
    metadata: "MetaData",
    name: "MyZmachine",
    version: 0,
    // data: zmachine.getData(),
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

  await grid.connect({
    chainURL: process.env.chainURL,
    relayURL: process.env.relayURL,
    mnemonic: process.env.mnemonic,
    twinId: +process.env.twinId
  })

  await grid.deploy({ deployment: deployment, nodeId: 11, twinId: +process.env.twinId, mnemonic: process.env.mnemonic });
}

main();
