interface ComputeCapacityData {
  cpu: number;
  memory: number;
}

class ComputeCapacityModel implements ComputeCapacityData {
  protected data: ComputeCapacityData;
  cpu: number;
  memory: number;

  constructor(data: ComputeCapacityData){
    this.data = data;
    this.memory = this.data.memory;
    this.cpu = this.data.cpu;
  }

  getData(): ComputeCapacityData{
    return this.data;
  }
}

class ComputeCapacityWorkload implements ComputeCapacityData {
  protected data: ComputeCapacityData;
  cpu: number;
  memory: number;

  constructor(data: ComputeCapacityData) {
    this.cpu = data.cpu;
    this.memory = data.memory;
    this.data = data;
  }

  getData(): ComputeCapacityData {
    return this.data;
  }

  challenge() {}
}

export {
  ComputeCapacityData,
  ComputeCapacityModel,
  ComputeCapacityWorkload,
}