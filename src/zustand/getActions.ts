'use client';

import { StateKeys } from './interface';

export const handleGetStateById = <T>(
  get: any,
  id: string,
  collection: StateKeys
): T => {
  const states = get();

  return states[collection]?.find((data: { id: string }) => data.id === id);
};
