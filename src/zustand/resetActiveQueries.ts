import { ZustandState } from './interface';
import zustandStore from './store';

export const resetActiveQueries = () => {
  const store = zustandStore.getStore();

  store.setState({ activeQuery: {} } as ZustandState);
};
