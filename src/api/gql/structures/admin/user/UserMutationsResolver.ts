import {Args, ArgsType, Field, Int, Mutation, Resolver} from 'type-graphql';
import {User} from '~/api/gql/structures';
import {EUserRole} from '~/shared/types';
import {CurrentUser, RequireRole, UseCurrentUser} from '~/api/gql/decorators';
import {UsersController} from '~/shared/controllers';
import {Inject} from 'typedi';
import {ForbiddenError, UserNotFoundError} from '~/api/gql/errors';

@ArgsType()
class SetUserRoleArgs {
  @Field(() => Int, {description: 'User identifier'})
  userId: number;

  @Field(() => EUserRole, {description: 'Assigned role'})
  role: EUserRole;
}

@Resolver()
export class UserMutationsResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  @RequireRole({oneOf: [EUserRole.Moderator, EUserRole.Admin]})
  @Mutation(() => User, {
    description: 'Changes user role',
  })
  setUserRole(
    @UseCurrentUser() user: CurrentUser,
    @Args(() => SetUserRoleArgs) args: SetUserRoleArgs,
  ): User {
    const {role, userId} = args;

    // Moderator cannot set admin or moderator role to someone.
    if (
      user.role === EUserRole.Moderator &&
      [EUserRole.Admin, EUserRole.Moderator].includes(role)
    ) {
      throw new ForbiddenError();
    }
    const updatedUser = this.controller.setUserRole(userId, role);

    if (updatedUser === null) {
      throw new UserNotFoundError();
    }
    return new User(updatedUser);
  }
}