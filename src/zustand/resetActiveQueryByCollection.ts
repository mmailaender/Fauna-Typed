import { callFqlxQuery } from '../client';
import { StateKeys, ZustandState } from './interface';
import zustandStore from './store';

export const resetActiveQueriesByCollection = async (collection: StateKeys) => {
  const store = zustandStore.getStore();
  const states = store.getState();

  const { activeQuery } = states;
  const activeQueryClone = { ...activeQuery };

  const activeQueriesKeys = Object.keys(activeQueryClone);

  for (let i = 0; i < activeQueriesKeys.length; i++) {
    const query = activeQueriesKeys[i];

    if (
      query
        ?.toLocaleLowerCase()
        ?.includes(collection?.toString().toLocaleLowerCase())
    ) {
      try {
        const res = await callFqlxQuery(query);
        activeQueryClone[query] = res;
      } catch (error) {
        console.error(`Failed to run query: ${query}`);
      }
    }
  }

  store.setState({
    activeQuery: activeQueryClone,
  } as ZustandState);
};
