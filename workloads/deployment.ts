import { DeploymentOptions } from "../utils/types";

export class Deployment {
  data: DeploymentOptions;
  constructor(data?: DeploymentOptions) {
    this.data = data ? data : this.init();
  }

  private init(): DeploymentOptions {
    return {
      description: "",
      expiration: 0,
      metadata: "",
      twin_id: 0,
      version: 0,
      workloads: [],
    };
  }
}
