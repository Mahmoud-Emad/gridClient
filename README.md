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

#### Connecting to the Grid

Before deploying any workloads, ensure that the client is connected to the grid.

```typescript
await grid.connect();
```

#### Creating Workloads

Define the components of the workload, such as `ZMount`, `Network`, and `ZMachine`, and then assemble them into a `Workload`.

```typescript
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

const zmachine = new ZMachine({
  flist: "https://hub.grid.tf/tf-official-vms/ubuntu-20.04-lts.flist",
  compute_capacity: {
    cpu: 1,
    memory: 2048,
  },
  corex: false,
  entrypoint: "/init.sh",
  env: {
    Key: "Value",
  },
  gpu: [],
  mounts: zmount.meta.mounts,
  network: znet.meta,
  rootFS: 45411,
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

#### Deploying Workloads

Deploy the assembled workload onto the grid.

```typescript
const deployment = new Deployment({
  description: "Some description",
  expiration: 15,
  metadata: "",
  twin_id: 143,
  version: 0,
  workloads: workload.all(),
  signatureRequirement: signatureRequirement,
});

await grid.deploy({ deployment: deployment });
```

#### Accessing Deployments

You can access the list of deployments made by the client.

```typescript
console.log("Deployments:", grid.deployments);
```

### Validators

The package includes validators to ensure proper usage. For example, the `@Validators.checkConnection()` decorator is used to ensure that the client is connected before deploying or deleting resources.

### Error Handling

In case of errors, the package throws `ConnectionError` or other relevant errors to provide meaningful feedback to users.

### Example

Here's a sample usage of the package:

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

async function main() {
  const grid = new GridClient();

  // Define workloads

  // Connect to the grid
  await grid.connect();

  // Deploy workloads
  await grid.deploy({ deployment: deployment });

  // Access deployments
  console.log("Deployments:", grid.deployments);
}

main();
```

### Conclusion

The `grid-client` package simplifies the process of deploying workloads onto the grid infrastructure. It provides a convenient interface and validators for ensuring correct usage.
