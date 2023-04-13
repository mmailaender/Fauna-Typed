import {
  ByIdMethods,
  DeleteMethods,
  UpdateMethods,
} from '../generated/typedefs';
import zustandStore from '../zustand/store';
import { StateKeys } from '../zustand/interface';
import { callFqlxQuery } from '../client';

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
      try {
        // Calling Fqlx API
        const res = await callFqlxQuery(query);

        // Storing API res in local state
        // this.store.setState({
        //   [this.collectionName]: {
        //     data: res ? [res] : [],
        //     after: null,
        //     before: null,
        //   },
        // });
        // return this.store.getState()[this.collectionName] as unknown as T;

        return res;
      } catch (error) {
        throw error;
      }
    };

    return {
      exec: executor,
      update: this.update,
      delete: this.delete,
    };
  };

  public update = (inputData: U): UpdateMethods<T> => {
    const query = `${this.collectionName}.byId("${
      this.fqlxDocId
    }").update(${JSON.stringify(inputData)})`;

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

        return res;
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
        this.store.getState().onDeleteSuccess(this.fqlxDocId);

        return res;
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
    };
  };
}
