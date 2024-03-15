import {
  Contract,
  DeploymentOptions,
  KeypairType,
  SignatureRequestData,
  SignatureRequirementData,
} from "../utils/types";

import * as md5 from "md5";
import { Workload } from "./workloads";
import { Keyring } from "@polkadot/keyring";
import { waitReady } from "@polkadot/wasm-crypto";


class Signature {
  twin_id: number;
  signature: string;
  signature_type: KeypairType;
}

class SignatureRequirement implements SignatureRequirementData {
  weight_required: number;
  requests: SignatureRequestData[];
  signatures: Signature[] = [];

  constructor(data: SignatureRequirementData) {
    this.weight_required = data.weight_required;
    this.requests = data.requests;
  }

  challenge(): string {
    return "";
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
}

class Deployment implements DeploymentOptions {
  meta: DeploymentOptions;
  version: number;
  twin_id: number;
  metadata: string;
  description: string;
  expiration: number;
  workloads: Workload[];
  signature_requirement: SignatureRequirement;
  contract_id?: number;
  contract?: Contract;

  constructor(meta?: DeploymentOptions) {
    this.meta = meta;
    this.version = meta.version;
    this.twin_id = meta.twin_id;
    this.metadata = meta.metadata;
    this.description = meta.description;
    this.expiration = meta.expiration;
    this.workloads = meta.workloads;
    this.signature_requirement = meta.signature_requirement;
    this.contract_id = meta.contract_id;
    this.contract = meta.contract;
  }

  challenge(): string {
    let out = "";
    out += `${this.meta.version}`;
    out += `${this.meta.twin_id}`;
    out += `${this.meta.metadata}`;
    out += `${this.meta.description}`;
    out += `${this.meta.expiration}`;

    this.meta.workloads.forEach((workload) => {
      out += workload.challenge();
    });

    out += this.meta.signature_requirement.challenge();

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
}