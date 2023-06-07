'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateKeys, ZustandState, ZustandStore } from './interface';
import {
  handleCreateDocument,
  handleCreateDocumentFailed,
  handleCreateDocumentSuccess,
} from './createActions';
import { handleGetStateById } from './getActions';
import {
  handleUpdateDocument,
  handleUpdateDocumentError,
  handleUpdateDocumentSuccess,
} from './updateActions';
import {
  handleDeleteDocument,
  handleDeleteDocumentError,
  handleDeleteDocumentSuccess,
} from './deleteActions';

export const createZustandWrapper = (): ZustandStore => {
  const store = create<ZustandState>()(
    persist(
      (set, get) =>
        ({
          // temp: [],
          fetchingPromise: {},
          activeQuery: {},
          create: <T>(inputData: T, collection: StateKeys) => {
            handleCreateDocument<T>(set, inputData, collection);
          },
          onCreateSuccess: (id: string, resId: string, collection: StateKeys) =>
            handleCreateDocumentSuccess(set, id, resId, collection),

          onCreateFailed: (id: string, collection: StateKeys) =>
            handleCreateDocumentFailed(set, id, collection),

          getStateById: <T>(id: string, collection: StateKeys) => {
            return handleGetStateById<T>(get, id, collection);
          },

          update: <T>(id: string, inputData: T, collection: StateKeys) => {
            handleUpdateDocument<T>(set, id, inputData, collection);
          },

          onUpdateSuccess: (id: string, collection: StateKeys) => {
            handleUpdateDocumentSuccess(set, id, collection);
          },

          onUpdateFailed: (id: string, collection: StateKeys) => {
            handleUpdateDocumentError(set, id, collection);
          },

          delete: (id: string, collection: StateKeys) => {
            handleDeleteDocument(set, id, collection);
          },

          onDeleteSuccess: (id: string, collection: StateKeys) => {
            handleDeleteDocumentSuccess(set, id, collection);
          },

          onDeleteFailed: (id: string, collection: StateKeys) => {
            handleDeleteDocumentError(set, id, collection);
          },
        } as ZustandState),
      { name: 'fauna-react' }
    )
  );

  return store;
};
