import {NonEmptyArray} from 'type-graphql';
import {UserQueriesResolver} from './user';

/**
 * Возвращает список резолверов для админской ручки TypeGraphQL.
 */
export function getAdminResolvers(): NonEmptyArray<any> {
  return [
    // UserMutationsResolver,
    UserQueriesResolver,
  ];
}