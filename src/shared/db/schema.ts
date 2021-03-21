import {IUser, IPost} from '~/shared/db/entities';

/**
 * List of collections in project.
 */
export enum ECollection {
  Posts = 'posts',
  Users = 'users',
}

/**
 * Description of MongoDB schema. Key is equal to some collection name
 * and value describes entity inside of it.
 */
export interface IDbSchemaMap {
  [ECollection.Users]: IUser;
  [ECollection.Posts]: IPost;
}

/**
 * List of all used collections.
 */
export type TDbSchemaCollectionName = keyof IDbSchemaMap;

/**
 * Returns entity description for specified collection.
 */
export type TDbSchemaEntity<C extends TDbSchemaCollectionName> = IDbSchemaMap[C];