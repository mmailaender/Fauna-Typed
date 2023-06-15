'use client';

import { v4 as uuid } from 'uuid';
import { CreateMethods } from '../interfaces/topLevelTypedefs';
import { StateKeys } from '../zustand/interface';
import zustandStore from '../zustand/store';
import { callFqlxQuery } from '../client';
import projection from './methods/projection';

export class CreateActions<T> {
  protected collectionName: StateKeys;
  private store = zustandStore.getStore();

  constructor(collectionName: StateKeys) {
    this.collectionName = collectionName;
  }

  public create = (inputData: T): CreateMethods<T> => {
    const query = `${this.collectionName}.create(${JSON.stringify(inputData)})`;

    const executor = async (): Promise<T> => {
      // Creating unique id to perform optimistic operation
      const uid = uuid();
      try {
        // Adding unique id with input data
        const inputDataWithUid = { ...inputData, id: uid };

        // Adding a document in state before calling API
        this.store.getState().create(inputDataWithUid, this.collectionName);

        // Calling Fqlx API
        const res = await callFqlxQuery(query);

        // Updating document id in local state
        this.store.getState().onCreateSuccess(uid, res.id, this.collectionName);

        return res;
      } catch (error) {
        // Removing added document from local state
        this.store.getState().onCreateFailed(uid, this.collectionName);

        throw error;
      }
    };

    return {
      exec: executor,
      project: projectionFields =>
        projection<T, T>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };
}
