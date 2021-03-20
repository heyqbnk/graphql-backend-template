import {NonEmptyArray} from 'type-graphql';
import {PostFieldsResolver} from './post';
import {UserFieldsResolver} from './user';

/**
 * Return list of shared resolvers of GraphQL.
 * @returns {NonEmptyArray<any>}
 */
export function getSharedResolvers(): NonEmptyArray<any> {
  return [
    PostFieldsResolver,
    UserFieldsResolver,
  ];
}