import {
  DeploymentOptions,
  GridSetOptions,
  WorkloadTypes,
} from "./utils/types";
import { Validators, isClientConnected } from "./utils/validators";
import { Deployment } from "./workloads/deployment";
import { Workload, ZMount, Network, ZMachine } from "./workloads/workloads";
import AwaitLock from "await-lock";

const chainURL = "wss://tfchain.dev.grid.tf/ws";
const relayURL = "wss://relay.dev.grid.tf";
const accountM =
  "actual reveal dish guilt inner film scheme between lonely myself material replace";

class GridClient {
  deployments: Deployment[];
  lock: AwaitLock;

  constructor() {
    this.deployments = [];
    this.lock = new AwaitLock();
  }

  async connect() {
    isClientConnected.value = true;
  }

  disconnect() {
    isClientConnected.value = false;
  }

  private set(options: GridSetOptions) {
    this.deployments.push(options.deployment);
  }

  @Validators.checkConnection()
  async deploy(options: GridSetOptions) {
    await this.lock.acquireAsync();
    try {
      this.set({ deployment: options.deployment });
    } finally {
      this.lock.release();
    }
  }

  @Validators.checkConnection()
  delete(_options: DeploymentOptions) {
    console.log("Deleting...");
  }
}

export {
  Deployment,
  GridClient,
  Workload,
  ZMount,
  Network,
  ZMachine,
  WorkloadTypes,
  DeploymentOptions,
  GridSetOptions,
};
