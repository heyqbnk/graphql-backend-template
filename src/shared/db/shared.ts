import {ObjectId} from 'bson';

export interface IPrimaryKey {
  /**
   * Unique document identifier.
   */
  _id: ObjectId;
}

/**
 * DB document by default.
 */
export interface IDocument extends IPrimaryKey {
}

