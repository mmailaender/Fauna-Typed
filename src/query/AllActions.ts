'use client';

import {
  AllMethods,
  FirstMethods,
  PaginateData,
  WhereMethods,
  FirstWhereMethods,
  OrderMethods,
  OrderMethodInput,
} from '../interfaces/topLevelTypedefs';
import { StateKeys } from '../zustand/interface';
import firstWhereMethod from './methods/firstWhere';
import projection from './methods/projection';
import map from './methods/map';
import count from './methods/count';
import { executor } from './executor';

export class AllActions<T> {
  protected collectionName: StateKeys;
  private whereQuery = '';

  constructor(collectionName: StateKeys) {
    this.collectionName = collectionName;
  }

  // This Creates query for Fqlx `all()` and returns methods for the same
  public all = (): AllMethods<T> => {
    const query = `${this.collectionName}.all()`;

    return {
      exec: () => executor(query),
      first: this.first(query),
      firstWhere: this.firstWhere,
      where: this.where,
      order: this.order,
      project: projectionFields =>
        projection<T, PaginateData<T>>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };

  // This Creates query for Fqlx `all().first()` and returns returns methods for the same
  public first = (queryPrefix: string) => (): FirstMethods<T> => {
    const query = `${queryPrefix}.first()`;

    return {
      exec: () => executor(query),
      project: projectionFields =>
        projection<T, T>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };

  // This Creates query for Fqlx `all().where()` and returns methods for the same
  public where = (input: ((data: T) => boolean) | string): WhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;
    const query = `${this.collectionName}.all().where(${condition})`;
    this.whereQuery = condition;

    return {
      exec: () => executor(query),
      order: this.order,
      map: callbackFn =>
        map<T>(this.collectionName as string, query, callbackFn),
      project: projectionFields =>
        projection<T, PaginateData<T>>(
          this.collectionName as string,
          query,
          projectionFields
        ),
      count: () => count(this.collectionName as string, query),
    };
  };

  // This Creates query for Fqlx `all().firstWhere()` and returns methods for the same
  public firstWhere = (
    input: ((data: T) => boolean) | string
  ): FirstWhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;

    const query = `${this.collectionName}.all().firstWhere(${condition})`;

    return firstWhereMethod(this.collectionName as string, query);
  };

  public order = (orderInput: OrderMethodInput<T>): OrderMethods<T> => {
    const query = this.whereQuery
      ? `${this.collectionName}.all().where(${this.whereQuery}).order(${orderInput})`
      : `${this.collectionName}.all().order(${orderInput})`;

    return {
      exec: () => executor(query),
      first: this.first(query),
      project: projectionFields =>
        projection<T, PaginateData<T>>(
          this.collectionName as string,
          query,
          projectionFields
        ),
    };
  };
}
