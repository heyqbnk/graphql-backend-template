import {Field, ObjectType} from 'type-graphql';
import {User} from '~/api/resolvers';
import {IPost} from '~/shared/db';
import {ObjectId} from 'mongodb';

@ObjectType({description: 'Post'})
export class Post {
  constructor(post: IPost) {
    const {userId, createdAt, content, title} = post;
    this.userId = userId;
    this.createdAt = createdAt;
    this.content = content;
    this.title = title;
  }
  userId: ObjectId;

  @Field(() => User, {description: 'Post owner'})
  user: User;

  @Field(() => String, {description: 'Title'})
  title: string;

  @Field(() => String, {description: 'Content'})
  content: string;

  @Field(() => Date, {description: 'Creation date'})
  createdAt: Date;
}