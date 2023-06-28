import { BasePaginateMethod } from '../../../interfaces/topLevelTypedefs';
import { executor } from '../../executor';

export default function paginate<T>(cursor: string): BasePaginateMethod<T> {
  const paginateQuery = `Set.paginate("${cursor}")`;

  return {
    exec: () => executor(paginateQuery),
  };
}
