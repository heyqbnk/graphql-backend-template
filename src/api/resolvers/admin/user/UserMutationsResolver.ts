import {Args, ArgsType, Field, Int, Mutation, Resolver} from 'type-graphql';
import {User} from '~/api/resolvers';
import {EUserRole} from '~/shared/types';
import {CurrentUser, UseCurrentUser} from '~/api/decorators';
import {UsersController} from '~/shared/controllers';
import {Inject} from 'typedi';
import {ForbiddenError, UserNotFoundError} from '~/api/errors';
import {ObjectIdScalar} from '~/api/scalars';
import {ObjectId} from 'bson';

@ArgsType()
class SetUserRoleArgs {
  @Field(() => ObjectIdScalar, {description: 'User identifier'})
  userId: ObjectId;

  @Field(() => EUserRole, {description: 'Assigned role'})
  role: EUserRole;
}

@Resolver()
export class UserMutationsResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  // @RequireRole({oneOf: [EUserRole.Moderator, EUserRole.Admin]})
  @Mutation(() => User, {
    description: 'Changes user role',
  })
  async setUserRole(
    @UseCurrentUser() user: CurrentUser,
    @Args(() => SetUserRoleArgs) args: SetUserRoleArgs,
  ): Promise<User> {
    const {role, userId} = args;

    // Moderator cannot set admin or moderator role to someone.
    if (
      user.role === EUserRole.Moderator &&
      [EUserRole.Admin, EUserRole.Moderator].includes(role)
    ) {
      throw new ForbiddenError();
    }
    await this.controller.setUserRole(userId, role);
    const updatedUser = await this.controller.findById(userId);

    if (updatedUser === null) {
      throw new UserNotFoundError();
    }
    return new User(updatedUser);
  }
}