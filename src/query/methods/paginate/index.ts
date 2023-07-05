import {
  BasePaginateMethod,
  PaginateData,
} from '../../../interfaces/topLevelTypedefs';
import { promisedExecutor } from '../../executor';

export default function paginate<T>(cursor: string): BasePaginateMethod<T> {
  const paginateQuery = `Set.paginate("${cursor}")`;

  return {
    exec: async () =>
      await promisedExecutor<Promise<PaginateData<T>>>(paginateQuery),
  };
}
