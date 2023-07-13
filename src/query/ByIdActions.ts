'use client';

import {
  ByIdMethods,
  DeleteMethods,
  UpdateMethods,
} from '../interfaces/topLevelTypedefs';
import zustandStore from '../zustand/store';
import { StateKeys } from '../zustand/interface';
import { callFqlxQuery } from '../client';
import projection from './methods/projection';

export class ByIdActions<T, U> {
  protected collectionName: StateKeys;
  private store = zustandStore.getStore();
  private fqlxDocId = '';

  constructor(collectionName: StateKeys) {
    this.collectionName = collectionName;
  }

  public byId = (fqlxDocId: string): ByIdMethods<T, U> => {
    this.fqlxDocId = fqlxDocId;
    const query = `${this.collectionName}.byId("${this.fqlxDocId}")`;

    const executor = async (): Promise<T> => {
      // Calling Fqlx API
      const res = await callFqlxQuery(query);

      return res as T;
    };

    return {
      exec: executor,
      update: this.update,
      delete: this.delete,
      project: (projectionFields) =>
        projection<T, T>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };

  public update = (inputData: U): UpdateMethods<T> => {
    const input =
      typeof inputData === 'string' ? inputData : JSON.stringify(inputData);
    const query = `${this.collectionName}.byId("${this.fqlxDocId}").update(${input})`;

    const executor = async (): Promise<T> => {
      try {
        // Updating the local state with the changes
        this.store
          .getState()
          .update(this.fqlxDocId, inputData, this.collectionName);

        const res = await callFqlxQuery(query);

        // Removing stored document form local state temp
        this.store
          .getState()
          .onUpdateSuccess(this.fqlxDocId, this.collectionName);

        return res as T;
      } catch (error) {
        // Undo changes from temp state
        this.store
          .getState()
          .onUpdateFailed(this.fqlxDocId, this.collectionName);

        throw error;
      }
    };

    return {
      exec: executor,
      project: (projectionFields) =>
        projection<T, T>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };

  public delete = (): DeleteMethods<T> => {
    const query = `${this.collectionName}.byId("${this.fqlxDocId}").delete()`;

    const executor = async (): Promise<T> => {
      try {
        //  Deleting the document from local state
        this.store.getState().delete(this.fqlxDocId, this.collectionName);

        // Calling Fqlx API
        const res = await callFqlxQuery(query);

        // Deleting the document from temp state
        this.store
          .getState()
          .onDeleteSuccess(this.fqlxDocId, this.collectionName);

        return res as T;
      } catch (error) {
        // Adding back the deleted document
        this.store
          .getState()
          .onDeleteFailed(this.fqlxDocId, this.collectionName);

        throw error;
      }
    };

    return {
      exec: executor,
      project: (projectionFields) =>
        projection<T, T>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };
}
