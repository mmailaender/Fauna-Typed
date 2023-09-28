import { useEffect } from 'react';
import { useLocalStorage as useTsLocalStorage } from 'usehooks-ts';

export const useLocalStorage = (
  storageKey: string,
  interfaceName: string
): { value: any; setValue(value: any): void } => {
  const initialFields = require('fauna-typed/src/fqlx-generated/collectionsWithFields.json');
  const initialValue = initialFields?.[interfaceName];

  const [value, setValue] = useTsLocalStorage(storageKey, initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, []);

  return { value, setValue };
};
