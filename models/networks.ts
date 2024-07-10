interface NetworkData {
  subnet: string;
  ip_range: string;
  wireguard_private_key: string;
  wireguard_listen_port: number;
  peers: string[];
}

interface ZMachineNetworkData {
  interfaces: ZMachineNetworkInterfaceData[];
}

interface ZMachineNetworkInterfaceData {
  network: string;
  ip: string;
  planetary: boolean;
  public_ip: string;
}

class ZMachineNetworkModel implements ZMachineNetworkData {
  private data: ZMachineNetworkData;
  interfaces: ZMachineNetworkInterfaceData[];

  constructor(data: ZMachineNetworkData) {
    this.data = data
    this.interfaces = this.data.interfaces
  }

  getData(): ZMachineNetworkData {
    return this.data;
  }
}

class NetworkWorkload implements NetworkData {
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
  challenge() {}
}

export {
  ZMachineNetworkData,
  ZMachineNetworkInterfaceData,
  ZMachineNetworkModel,
  NetworkWorkload,
  NetworkData,
}