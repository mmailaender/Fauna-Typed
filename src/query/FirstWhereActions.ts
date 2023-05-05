'use client';

import { FirstWhereMethods } from '../interfaces/topLevelTypedefs';
import { StateKeys } from '../zustand/interface';
import firstWhereMethod from './methods/firstWhere';

export class FirstWhereActions<T> {
  protected collectionName: StateKeys;

  constructor(collectionName: StateKeys) {
    this.collectionName = collectionName;
  }

  // This Creates query for Fqlx `firstWhere()` and returns methods for the same
  public firstWhere = (
    input: ((data: T) => boolean) | string
  ): FirstWhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;

    const query = `${this.collectionName}.firstWhere(${condition})`;

    return firstWhereMethod(this.collectionName as string, query);
  };
}
