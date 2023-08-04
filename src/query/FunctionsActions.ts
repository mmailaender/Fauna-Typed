'use client';

import { promisedExecutor } from './executor';

export class FunctionsActions<T> {
  public call = (): { [key in keyof T]: Function } => {
    return new Proxy(
      {},
      {
        get(_target, functionName: string) {
          return async (...args: any): Promise<any> => {
            const stringifiedArgs = JSON.stringify(args);
            const params = stringifiedArgs.substring(
              1,
              stringifiedArgs.length - 1
            );

            const query = `${functionName}(${params})`;

            return await promisedExecutor(query);
          };
        },
      }
    ) as { [key in keyof T]: Function };
  };
}
