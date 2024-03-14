import { DeploymentOptions, SignatureRequestData, SignatureRequirementData } from "../utils/types";


export class SignatureRequirement implements SignatureRequirementData {
  weight_required: number;
  requests: SignatureRequestData[];

  constructor(data: SignatureRequirementData){
    this.weight_required = data.weight_required
    this.requests = data.requests
  }
}

export class SignatureRequest implements SignatureRequestData {
  twin_id: number;
  weight: number;
  required: boolean;

  constructor(data: SignatureRequest){
    this.twin_id = data.twin_id
    this.weight = data.weight
    this.required = data.required
  }
}

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
      signatureRequirement: {
        requests: [],
        weight_required: 0
      },
    };
  }
}
