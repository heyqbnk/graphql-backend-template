import {Field, Int, Maybe, ObjectType} from 'type-graphql';
import {IUser} from '~/shared/db';
import {Post} from '~/api/resolvers';
import {ObjectIdScalar} from '~/api/scalars';
import {ObjectId} from 'mongodb';

@ObjectType({description: 'User information'})
export class User {
  constructor(user: IUser) {
    const {lastName, _id, firstName} = user;
    this.id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @Field(() => ObjectIdScalar, {description: 'Unique identifier'})
  id: ObjectId;

  @Field(() => String, {description: 'First name'})
  firstName: string;

  @Field(() => String, {description: 'Last name', nullable: true})
  lastName?: Maybe<string>;

  @Field(() => [Post], {description: 'User posts count', defaultValue: []})
  posts: Post[];
}