import {
  Arg,
  Int,
  Maybe,
  Query,
  Resolver
} from 'type-graphql';
import {User} from '~/api/resolvers';
import {EUserRole} from '~/shared/types';
// import {RequireRole} from '~/api/decorators';
import {UsersController} from '~/shared/controllers';
import {Inject} from 'typedi';
import {UserNotFoundError} from '~/api/errors';
import {ObjectIdScalar} from '~/api/scalars';
import {ObjectId} from 'bson';

@Resolver()
export class UserQueriesResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  // @RequireRole({oneOf: [EUserRole.Moderator, EUserRole.Admin]})
  @Query(() => User, {
    description: 'Returns user by id',
    nullable: true,
  })
  async user(
    @Arg('userId', () => ObjectIdScalar, {
      description: 'User identifier'
    }) userId: ObjectId,
  ): Promise<Maybe<User>> {
    const user = await this.controller.findById(userId);

    if (user === null) {
      throw new UserNotFoundError();
    }
    return new User(user);
  }
}