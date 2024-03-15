## Grid Client Package

This package provides a client interface (`GridClient`) for interacting with a grid infrastructure. It allows users to deploy and manage deployments of workloads onto the grid.

### Usage

#### Importing the Required Modules

Import the necessary modules from the package to start using the `GridClient`.

```typescript
import {
  GridClient,
  Deployment,
  Network,
  Workload,
  WorkloadTypes,
  ZMount,
  ZMachine,
} from "grid-client";
```

#### Setting Up the Grid Client

Create an instance of `GridClient` to interact with the grid.

```typescript
const grid = new GridClient();
```

#### Creating Workloads

Define the components of the workload, such as `ZMount`, `Network`, and `ZMachine`, and then assemble them into a `Workload`.

```typescript
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
```

#### Connecting to the Grid and Deploying Workloads

Connect to the grid and deploy the assembled workload onto it.

```typescript
await grid.connect({
  chainURL: process.env.chainURL,
  relayURL: process.env.relayURL,
  mnemonic: process.env.mnemonic,
  twinId: +process.env.twinId
});

await grid.deploy({ deployment: deployment, nodeId: 11, twinId: 143, mnemonic: process.env.mnemonic });
```

#### Accessing Deployments

You can access the list of deployments made by the client.

```typescript
console.log("Deployments:", grid.deployments);
```
