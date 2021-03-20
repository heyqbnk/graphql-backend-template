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

@Resolver()
export class UserQueriesResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  // @RequireRole({oneOf: [EUserRole.Moderator, EUserRole.Admin]})
  @Query(() => User, {
    description: 'Returns user by id',
    nullable: true,
  })
  user(
    @Arg('userId', () => Int, {
      description: 'User identifier'
    }) userId: number,
  ): Maybe<User> {
    const user = this.controller.getById(userId);

    if (user === null) {
      throw new UserNotFoundError();
    }
    return new User(user);
  }
}