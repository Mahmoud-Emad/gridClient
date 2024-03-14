import {
  DeploymentOptions,
  GridSetOptions,
  KeypairType,
  WorkloadTypes,
} from "./utils/types";
import { Validators, isClientConnected } from "./utils/validators";
import {
  Deployment,
  SignatureRequest,
  SignatureRequirement,
} from "./workloads/deployment";
import {
  Workload,
  ZMount,
  Network,
  ZMachine,
  ComputeCapacity,
  DiskMount,
} from "./workloads/workloads";
import AwaitLock from "await-lock";
import { Client as RMBClient } from "@threefold/rmb_direct_client";

const chainURL = "wss://tfchain.dev.grid.tf/ws";
const relayURL = "wss://relay.dev.grid.tf";
const mnemonic =
  "actual reveal dish guilt inner film scheme between lonely myself material replace";

class GridClient {
  deployments: Deployment[];
  lock: AwaitLock;
  rmbClient: RMBClient;

  constructor() {
    this.deployments = [];
    this.lock = new AwaitLock();
  }

  async connect() {
    const rmbClient = new RMBClient(
      chainURL,
      relayURL,
      mnemonic,
      "test",
      KeypairType.sr25519,
      5
    );
    this.rmbClient = rmbClient;
    this.rmbClient.connect();
    this.log("Client connected!");
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
    console.log("Lock acquired");
    try {
      this.set({ deployment: options.deployment });
    } finally {
      this.lock.release();
      console.log("Lock released");
    }
  }

  @Validators.checkConnection()
  delete(_options: DeploymentOptions) {
    console.log("Deleting...");
  }

  log(message: string) {
    console.log(`|+| ${message}`);
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
  SignatureRequest,
  ComputeCapacity,
  DiskMount,
  SignatureRequirement,
};
