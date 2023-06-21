'use client';

import { SetMethods } from '../interfaces/topLevelTypedefs';
import paginate from './methods/paginate';

export class SetActions<T> {
  public set = (): SetMethods<T> => {
    return {
      paginate: (cursor) => paginate(cursor)
    };
  };
}

