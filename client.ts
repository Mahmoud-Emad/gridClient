import {
  ClientOptions,
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
import { Client as TFClient, Contract } from "@threefold/tfchain_client";

class GridClient {
  deployments: Deployment[];
  lock: AwaitLock;
  rmbClient: RMBClient;
  tfClient: TFClient;

  constructor() {
    this.deployments = [];
    this.lock = new AwaitLock();
  }

  async connect(options: ClientOptions) {
    const rmbClient = new RMBClient(
      options.chainURL,
      options.relayURL,
      options.mnemonic,
      "test",
      KeypairType.sr25519,
      5
    );

    this.rmbClient = rmbClient;
    this.rmbClient.connect();
    this.log("RMB client connected!");

    const tfClient = new TFClient({
      url: options.chainURL,
      mnemonicOrSecret: options.mnemonic,
      keypairType: KeypairType.sr25519,
      keepReconnecting: true,
    });
    this.tfClient = tfClient;
    await this.tfClient.connect();

    this.log("TFChain client connected!");
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
    this.log("Deploying deployment: " + options.deployment.meta);

    await this.lock.acquireAsync();
    this.log("Lock acquired");

    try {
      const hash = options.deployment.challengeHash();
      this.log("Deployment hash: " + hash);
  
      this.log("Creating contract");
      const contract = await (
        await this.tfClient.contracts.createNode({
          hash,
          numberOfPublicIps: 0,
          nodeId: options.nodeId,
          solutionProviderId: 1,
          data: JSON.stringify({
            version: 3,
            type: "vm",
            name: "myvm",
            projectName: "vm/myvm",
          }),
        })
      ).apply();
      this.log("Contract created!: " + contract);
  
      options.deployment.contract_id = contract.contractId;
      options.deployment.sign(options.twinId, options.mnemonic, KeypairType.sr25519);
      options.deployment.contract = contract;

      this.set({ deployment: options.deployment, nodeId: options.nodeId, twinId: options.twinId, mnemonic: options.mnemonic });

      const deployMessageID = await this.rmbClient.send(
        "zos.deployment.deploy",
        JSON.stringify(options.deployment.meta),
        12,
        1,
        3
      );

      this.log("Message id " + deployMessageID);
      const deployMessageReply = await this.rmbClient.read(deployMessageID);
      this.log("Message reply " + deployMessageReply);
    } finally {
      this.lock.release();
      this.log("Lock released");
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
  Contract
};
