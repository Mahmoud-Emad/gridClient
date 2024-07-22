import { Deployment, GridClient, SignatureRequest, SignatureRequirement, Workload, WorkloadTypes } from "./client";

import * as dotenv from "dotenv";
import { DiskMountModel, ZMountModel } from "./models/disks";
import { ZMachineModel } from "./models/machines";
import { ComputeCapacityModel } from "./models/capacity";
import { ZMachineNetworkModel, ZnetModel } from "./models/networks";

dotenv.config(); // Load all env vars.

async function main() {
  const grid = new GridClient();
  const mountDisk = new DiskMountModel({
    name: "disk1",
    mountpoint: "/mnt/data",
  });

  const zmount = new ZMountModel({
    mounts: [ mountDisk ],
    size: 5385856364,
  })

  const diskWorkload = new Workload({
    name: "mydisk",
    version: 0,
    type: WorkloadTypes.zmount,
    data: zmount.getData(),
    description: "",
    metadata: "",
  })

  const znet = new ZnetModel({
    ip_range: "10.20.0.0/16",
    subnet: "10.20.2.0/24",
    peers: [],
    wireguard_private_key: process.env.wireguardPrivateKey,
    wireguard_listen_port: 18965
  })

  const networkWorkload = new Workload({
    name: "mynetwork",
    version: 0,
    type: WorkloadTypes.network,
    data: znet.getData(),
    description: "",
    metadata: JSON.stringify({"version": 3, "user_accesses": []}),
  })

  const machineNetwork = new ZMachineNetworkModel({
    planetary: true,
    public_ip: "",
    interfaces: [
      {
        ip: "10.20.2.2",
        network: "mynetwork",
      }
    ]
  })

  const computeCapacity = new ComputeCapacityModel({ cpu: 1, memory: 1024 });

  const vm = new ZMachineModel({
    flist: "https://hub.grid.tf/tf-official-vms/ubuntu-20.04-lts.flist",
    compute_capacity: computeCapacity.getData(),
    corex: false,
    entrypoint: "/init.sh",
    env: {
      "SSH_KEY": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCF3JezThwSchTvkF2oPtn8X6chevNsfE58dIY3/eg5zK9tKgNYIB2saoFh12a0AJU424sAeLO0HghhNhe/Co62xkzHhk6EpXWNSFkrlzw+FVn1FKDZbbOZH47sC3n6p5a3YhM4dALssZ/aZdpaKBgXkzk91usJ+GVa+eOnpMRBlHgi9PpvowyzPSKeH9ZcVRBPnVU+nQGyV+kd6RahNBoNgNrHu/QFI92yg/y/7Szus1IS0U92cWKf/K/Sot7O10kSjmj06lMGOO8zdENk/xrtUtRHzemCj+mq0Q/3KUMCGvdb/tH0TDeNenxvibummiym4VTcnYqbm+RDXWG8HUc/RPfEVBl8p1NGZnkBt6QJl5hddHaYwx8CCmf3maSrQFcmrWYtlUDBXYkPyrv0qmy2gM1PScntF/X9zhIfnELlyAVAKXfzVwixrBh7oOIAqefydSVcwWtCXoH38F5q/zo9bQv+eHntI83mZrUUT7JGirQF64fpJKbCZPhv0kUm9bF7DVQMiyRZdk748cgVp7dEzMVlrfZ2eIvZag5zmuJTPB7bw00+Ik9jNaOIhEoCWEaYBw7KmrLonesV8rWUkEAwWPe28bXCVmUZlgZbWJi7BFWCst2Z/j2WgScHbdAv28gAcneDW4yQmt2YaYqXqmwgSVCaD/irq5FSO4upmo5u0Q== mahmmoud.hassanein@gmail.com",
    },
    gpu: [],
    mounts: zmount.mounts,
    network: machineNetwork,
    size: 4545415111,
  })

  const vmWorkload = new Workload({
    description: "",
    metadata: "",
    name: "myvm",
    version: 0,
    data: vm.getData(),
    type: WorkloadTypes.zmachine
  })

  console.log("process.env.twinId", process.env.twinId)
  const signatureRequest = new SignatureRequest({
    required: false,
    twin_id: +process.env.twinId,
    weight: 1,
  });

  const signatureRequirement = new SignatureRequirement({
    requests: [signatureRequest],
    weight_required: 1,
  });

  const deployment = new Deployment({
    name: "myvm",
    description: "Some description",
    expiration: 30,
    metadata: "",
    twin_id: +process.env.twinId,
    version: 0,
    workloads: [ diskWorkload, networkWorkload ],
    signature_requirement: signatureRequirement,
  });

  console.log({deployment: deployment.data})
  console.log({deployment: deployment.data.signature_requirement.requests})

  await grid.connect({
    chainURL: process.env.chainURL,
    relayURL: process.env.relayURL,
    mnemonic: process.env.mnemonic,
    twinId: +process.env.twinId
  })

  await grid.deploy({ deployment: deployment, nodeId: 11, twinId: +process.env.twinId, mnemonic: process.env.mnemonic });
}

main();
