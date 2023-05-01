'use client';

import React from 'react';
import { configState, useConfigStore } from './configStore';

export const FqlxProvider = ({
  config,
  children,
}: {
  config: { fqlxSecret: string };
  children: React.ReactElement;
}): JSX.Element => {
  const { setFqlxSecret, fqlxSecret } = useConfigStore(
    (state: configState) => state
  );
  console.log('config===========', config.fqlxSecret);

  if (!config.fqlxSecret) {
    throw new Error('Missing Fauna Secret');
  }

  if (config.fqlxSecret !== fqlxSecret) {
    setFqlxSecret(config.fqlxSecret);
  }

  if (!fqlxSecret) {
    return <div>Loading...</div>;
  }

  console.log('secret in store========', fqlxSecret);

  return children;
};
