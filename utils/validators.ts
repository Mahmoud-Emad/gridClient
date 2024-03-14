import { ConnectionError } from "./errors";

const isClientConnected: { value: boolean } = new Proxy({ value: false }, {});

class Validators {
  static checkConnection() {
    return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
      const originalMethod: any = descriptor.value;
      let isInitialized: boolean = false;

      descriptor.value = function (...args: Array<unknown>): void {
        if (isInitialized || !originalMethod) {
          return;
        }

        if (!isClientConnected.value) {
          throw new ConnectionError(
            "Unable to proceed. The grid connection is not established. Please ensure you connect to the grid using the 'connect' method before deploying or deleting resources."
          );
        }

        isInitialized = true;
        originalMethod.apply(this, args);
      };
    };
  }
}

export { isClientConnected, Validators };
