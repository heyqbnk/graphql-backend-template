import {Args, ArgsType, Field, Query, Resolver} from 'type-graphql';
import {User} from '~/api/gql/structures';
import {Inject} from 'typedi';
import {AccessController, UsersController} from '~/shared/controllers';
import {UserNotFoundError} from '~/api/gql/errors';
import {CurrentUser, RequireScope, UseCurrentUser} from '~/api/gql/decorators';
import {EAccessScope} from '~/shared/types';

@ArgsType()
class LoginArgs {
  @Field(() => String, {description: 'Login'})
  login: string;

  @Field(() => String, {description: 'Password'})
  password: string;
}

@Resolver()
export class UserQueriesResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  @Inject(() => AccessController)
  accessController: AccessController;

  @RequireScope(EAccessScope.ReadUserInfo)
  @Query(() => User, {
    description: 'Returns information about current user',
  })
  user(@UseCurrentUser() user: CurrentUser): User {
    return new User(user);
  }

  @Query(() => String, {
    description: 'Authenticates user and returns token with default ' +
      'access scopes'
  })
  login(
    @Args(() => LoginArgs) args: LoginArgs,
  ): string {
    const {login, password} = args;
    const user = this.controller.getByLoginAndPassword(login, password);

    if (user === null) {
      throw new UserNotFoundError();
    }
    return this.accessController.createDefaultUserToken(user.id);
  }
}
