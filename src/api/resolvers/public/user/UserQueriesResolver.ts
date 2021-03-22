import {Arg, Query, Resolver} from 'type-graphql';
import {Inject} from 'typedi';
import {UsersController} from '~/shared/controllers';
import {UserNotFoundError} from '~/api/errors';
import {User} from '~/api/resolvers';
import {UseCurrentUser, CurrentUser} from '~/api/decorators';

@Resolver()
export class UserQueriesResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  @Query(() => User, {
    description: 'Returns information about current user',
  })
  user(@UseCurrentUser() user: CurrentUser): User {
    return new User(user);
  }

  @Query(() => String, {
    description: 'Authenticates user returning his json web token',
  })
  async login(
    @Arg('login', () => String, {description: 'Login'})
      login: string,
    @Arg('password', () => String, {description: 'Password'})
      password: string,
  ): Promise<string> {
    const token = await this.controller.login(login, password);

    if (token === null) {
      throw new UserNotFoundError;
    }
    return token;
  }
}
