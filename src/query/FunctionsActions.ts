'use client';

import { promisedExecutor } from './executor';

export class FunctionsActions<T> {
  public call = (): { [key in keyof T]: '' } => {
    return new Proxy(
      {},
      {
        get(_target, functionName: string): Promise<any> {
          // @ts-expect-error
          return async (...args) => {
            const query = `${functionName}(${args.join(' , ')})`;

            return await promisedExecutor(query);
          };
        },
      }
    ) as { [key in keyof T]: '' };
  };
}
