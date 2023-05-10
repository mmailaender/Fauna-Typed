'use client';

import { endpoints } from 'fauna';
import { create } from 'zustand';

export interface configState {
  fqlxSecret: string;
  fqlxEndpoint: URL;
  setFqlxSecret(secret: string): void;
  setFqlxEndpoint(endpoint: URL): void;
}

export const useConfigStore = create<configState>(set => ({
  fqlxSecret: '',
  fqlxEndpoint: new URL(endpoints.preview),
  setFqlxSecret: (secret: string) => set(() => ({ fqlxSecret: secret })),
  setFqlxEndpoint: (endpoint: URL) => set(() => ({ fqlxEndpoint: endpoint })),
}));
