'use client';

import { endpoints } from 'fauna';
import { create } from 'zustand';

export interface configState {
  fqlxSecret: string;
  fqlxEndpoint: string;
  setFqlxSecret(secret: string): void;
  setFqlxEndpoint(endpoint: string): void;
}

export const useConfigStore = create<configState>(set => ({
  fqlxSecret: '',
  fqlxEndpoint: (endpoints.preview as unknown) as string,
  setFqlxSecret: (secret: string) => set(() => ({ fqlxSecret: secret })),
  setFqlxEndpoint: (endpoint: string) =>
    set(() => ({ fqlxEndpoint: endpoint })),
}));
