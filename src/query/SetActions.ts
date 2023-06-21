'use client';

import { SetMethods } from '../interfaces/topLevelTypedefs';
import paginate from './methods/paginate';

export class SetActions {
  public set = (): SetMethods => {
    return {
      paginate: cursor => paginate(cursor),
    };
  };
}
