import {IDocument} from '~/shared/db';
import {ObjectId} from 'mongodb';

export interface IPost extends IDocument {
  userId: ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  deletedAt?: Date;
}