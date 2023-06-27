import { callFqlxQuery } from '../../../client';
import { NETWORK_ERROR } from '../../../error';
import {
  ExecMethods,
  ProjectionFieldsInputType,
} from '../../../interfaces/topLevelTypedefs';
import { ZustandState } from '../../../zustand/interface';
import zustandStore from '../../../zustand/store';

const mapProjectionFields = <T>(
  projectionFields: Partial<ProjectionFieldsInputType<T>>
): string => {
  return Object.entries(projectionFields)
    .map(field => {
      const key = field[0];
      const value = field[1];

      if (typeof value === 'object') {
        if (!Array.isArray(value)) {
          return `${key} { ${mapProjectionFields(
            value as ProjectionFieldsInputType<T>
          )} }`;
        }

        return `${key} { ${mapProjectionFields(
          value[0] as ProjectionFieldsInputType<T>
        )} }`;
      }

      return key;
    })
    .join(', ');
};

export default function projection<T, RES_TYPE>(
  collectionName: string,
  query: string,
  projectionFields: Partial<ProjectionFieldsInputType<T>>
): ExecMethods<RES_TYPE> {
  // @ts-expect-error
  const executor = (): RES_TYPE => {
    const store = zustandStore.getStore();
    const mappedFields = mapProjectionFields(projectionFields);

    const q = `${query} { ${mappedFields} }`;
    // Checking, query is already executed
    if (store.getState().activeQuery[q]) {
      // Return data from state
      return (store.getState().activeQuery[q] as unknown) as RES_TYPE;
    }

    // Calling Fqlx API
    const req = callFqlxQuery(q);

    let error = '';
    let status = 'pending';

    req
      .then((res: { [key: string]: any }) => {
        status = 'success';
        // Storing API res in local state
        store.setState({
          // [collectionName]: res || {},
          activeQuery: {
            ...store.getState().activeQuery,
            [q]: res || {},
          },
        } as ZustandState);

        return (store.getState()[collectionName] || {}) as T;
      })
      .catch((err: { message: string }) => {
        status = 'error';
        error = err?.message;

        if (!err?.message?.includes(NETWORK_ERROR)) {
          store.setState(({
            // [collectionName]: {},
            activeQuery: {
              ...store.getState().activeQuery,
              [q]: false,
            },
          } as unknown) as ZustandState);
        }

        store.setState(({
          activeQuery: {
            ...store.getState().activeQuery,
            [q]: {},
          },
        } as unknown) as ZustandState);
      }) as T;

    if (status === 'pending') {
      throw req as T;
    }

    if (status === 'error') {
      throw new Error(error) as T;
    }

    if (status === 'success') {
      return (store.getState()[collectionName] || {}) as RES_TYPE;
    }
  };

  return {
    exec: executor,
  };
}
