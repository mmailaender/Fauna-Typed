'use client';

import React from 'react';
import { configState, useConfigStore } from './configStore';

export const FqlxProvider = ({
  config,
  // loader,
  children,
}: {
  config: { fqlxSecret: string };
  // loader: React.ReactElement;
  children: React.ReactElement;
}): JSX.Element => {
  const { setFqlxSecret, fqlxSecret } = useConfigStore(
    (state: configState) => state
  );
  console.log('config===========', config.fqlxSecret);

  if (!config.fqlxSecret) {
    console.log('============missing secret');
    throw new Error('Missing Fauna Secret');
  }

  if (config.fqlxSecret !== fqlxSecret) {
    console.log('============updating secret');
    setFqlxSecret(config.fqlxSecret);
  }

  if (!fqlxSecret) {
    console.log('============loading');
    return <div>Loading...</div>;
  }

  console.log('secret in store========', fqlxSecret);

  return children;
};
