import {Field, Int, Maybe, ObjectType} from 'type-graphql';
import {IUser} from '~/shared/db';
import {Post} from '~/api/resolvers';

@ObjectType({description: 'User information'})
export class User {
  constructor(user: IUser) {
    const {lastName, id, firstName} = user;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @Field(() => Int, {description: 'Unique identifier'})
  id: number;

  @Field(() => String, {description: 'First name'})
  firstName: string;

  @Field(() => String, {description: 'Last name', nullable: true})
  lastName?: Maybe<string>;

  @Field(() => [Post], {description: 'User posts count', defaultValue: []})
  posts: Post[];
}