interface NetworkData {
  subnet: string;
  ip_range: string;
  wireguard_private_key: string;
  wireguard_listen_port: number;
  peers: string[];
}

interface ZMachineNetworkData {
  planetary: boolean;
  public_ip: string;
  interfaces: ZMachineNetworkInterfaceData[];
}

interface ZMachineNetworkInterfaceData {
  network: string;
  ip: string;
}

class ZMachineNetworkModel implements ZMachineNetworkData {
  private data: ZMachineNetworkData;
  interfaces: ZMachineNetworkInterfaceData[];
  planetary: boolean;
  public_ip: string;

  constructor(data: ZMachineNetworkData) {
    this.data = data;
    this.interfaces = this.data.interfaces;
    this.planetary = this.data.planetary;
    this.public_ip = this.data.public_ip;
  }

  getData(): ZMachineNetworkData {
    return this.data;
  }
}

class ZnetModel implements NetworkData {
  private meta: NetworkData;
  subnet: string;
  ip_range: string;
  wireguard_private_key: string;
  wireguard_listen_port: number;
  peers: string[];

  constructor(meta: NetworkData) {
    this.meta = meta;
    this.subnet = meta.subnet;
    this.ip_range = meta.ip_range;
    this.wireguard_listen_port = meta.wireguard_listen_port;
    this.wireguard_private_key = meta.wireguard_private_key;
    this.peers = meta.peers;
  }

  getData(): NetworkData {
    return this.meta;
  }
}

class NetworkWorkload extends ZnetModel {
  challenge() {}
}

export {
  ZMachineNetworkData,
  ZMachineNetworkInterfaceData,
  ZMachineNetworkModel,
  NetworkWorkload,
  NetworkData,
  ZnetModel,
};
