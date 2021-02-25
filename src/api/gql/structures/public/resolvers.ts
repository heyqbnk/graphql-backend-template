import {NonEmptyArray} from 'type-graphql';
import {PostMutationsResolver, PostQueriesResolver} from './post';
import {UserMutationsResolver, UserQueriesResolver} from './user';

/**
 * Return list of public resolvers of GraphQL.
 */
export function getPublicResolvers(): NonEmptyArray<any> {
  return [
    PostMutationsResolver,
    PostQueriesResolver,
    UserMutationsResolver,
    UserQueriesResolver,
  ];
}