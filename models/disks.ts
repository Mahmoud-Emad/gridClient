interface DiskMountData {
  name: string;
  mountpoint: string;
}

interface ZMountData {
  size: number;
  mounts: DiskMountData[];
}


class DiskMountModel implements DiskMountData {
  protected data: DiskMountData;
  name: string;
  mountpoint: string;

  constructor(data: DiskMountData){
    this.data = data;
    this.name = this.data.name;
    this.mountpoint = this.data.mountpoint;
  }

  getData(): DiskMountData{
    return this.data;
  }
}

class ZMountModel implements ZMountData {
  size: number;
  mounts: DiskMountData[];
  protected data: ZMountData;

  constructor(data: ZMountData) {
    this.data = data;
    this.size = data.size;
    this.mounts = data.mounts;
  }

  getData(): ZMountData {
    return this.data;
  }
}

export {
  DiskMountModel,
  DiskMountData,
  ZMountModel,
  ZMountData,
}