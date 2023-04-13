import { createZustandWrapper } from './createZustandWrapper';
import { ZustandStore } from './interface';

class Store {
  store: ZustandStore | undefined;

  getStore(): ZustandStore {
    if (!this.store) {
      this.store = createZustandWrapper();
    }
    return this.store;
  }
}

const store = new Store();

export default store;
