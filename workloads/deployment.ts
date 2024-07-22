import {
  Contract,
  DeploymentOptions,
  KeypairType,
} from "../utils/types";

import * as md5 from "md5";
import { Workload } from "./workloads";
import { Keyring } from "@polkadot/keyring";
import { waitReady } from "@polkadot/wasm-crypto";

interface SignatureRequestData {
  twin_id: number;
  weight: number;
  required: boolean;
}

interface SignatureRequirementData {
  weight_required: number;
  requests: SignatureRequestData[];
  signatures?: Signature[];
}

class Signature {
  twin_id: number;
  signature: string;
  signature_type: KeypairType;
}

class SignatureRequirement implements SignatureRequirementData {
  data: SignatureRequirementData;
  weight_required: number;
  requests: SignatureRequest[];
  signatures: Signature[] = [];

  constructor(data: SignatureRequirementData) {
    this.data = data
    this.weight_required = this.data.weight_required;
    this.requests = this.data.requests;
  }

  challenge(): string {
    let out = "";

    for (let i = 0; i < this.requests.length; i++) {
      out += this.requests[i].challenge();
    }

    out += this.weight_required;
    return out;
  }

  getData(){
    return this.data
  }
}

class SignatureRequest implements SignatureRequestData {
  twin_id: number;
  weight: number;
  required: boolean;

  constructor(data: SignatureRequest) {
    this.twin_id = data.twin_id;
    this.weight = data.weight;
    this.required = data.required;
  }

  challenge?(): string {
    let out = "";
    out += this.twin_id;
    out += this.required;
    out += this.weight;

    return out;
  }
}

class Deployment implements DeploymentOptions {
  data: DeploymentOptions;
  name: string;
  version: number;
  twin_id: number;
  metadata: string;
  description: string;
  expiration: number;
  workloads: Workload[];
  signature_requirement: SignatureRequirement;
  contract_id?: number;
  contract?: Contract;

  constructor(data: DeploymentOptions) {
    this.data = data;
    this.version = this.data.version;
    this.name = this.data.name;
    this.twin_id = this.data.twin_id;
    this.metadata = this.data.metadata;
    this.description = this.data.description;
    this.expiration = this.data.expiration;
    this.workloads = this.data.workloads;
    this.signature_requirement = this.data.signature_requirement;
    this.contract_id = this.data.contract_id;
    this.contract = this.data.contract;
  }

  challenge(): string {
    let out = "";
    out += `${this.data.version}`;
    out += `${this.data.twin_id}`;
    out += `${this.data.metadata}`;
    out += `${this.data.description}`;
    out += `${this.data.expiration}`;

    this.data.workloads.forEach((workload) => {
      out += workload.challenge();
    });

    out += this.data.signature_requirement.challenge();

    return out;
  }

  challengeHash() {
    return md5(this.challenge()).toString();
  }

  fromHex(str: string){
    const result = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length / 2; i++) {
      result[i] = parseInt(str.substr(2 * i, 2), 16);
    }
    return result;
  }

  toHex(bytes: Uint8Array): string{
    const encoded: string[] = [];
    for (let i = 0; i < bytes.length; i++) {
      encoded.push("0123456789abcdef"[(bytes[i] >> 4) & 15]);
      encoded.push("0123456789abcdef"[bytes[i] & 15]);
    }
    return encoded.join("");
  }

  async sign(twin_id: number, mnemonic: string, keypairType: KeypairType, hash = ""): Promise<void> {
    const message = hash || this.challengeHash();
    const message_bytes = this.fromHex(message);

    const keyr = new Keyring({ type: keypairType });
    await waitReady();
    const key = keyr.addFromUri(mnemonic);
    const signed_msg = key.sign(message_bytes);
    const hex_signed_msg = this.toHex(signed_msg);

    for (let i = 0; i < this.signature_requirement.signatures.length; i++) {
      if (this.signature_requirement.signatures[i].twin_id === twin_id) {
        this.signature_requirement.signatures[i].signature = hex_signed_msg;
        this.signature_requirement.signatures[i].signature_type = keypairType;
      }
    }

    const signature = new Signature();
    signature.twin_id = twin_id;
    signature.signature = hex_signed_msg;
    signature.signature_type = keypairType;
    this.signature_requirement.signatures.push(signature);
  }
}

export {
  Signature,
  SignatureRequest,
  SignatureRequirement,
  Deployment,
  Workload,
  SignatureRequirementData,
}