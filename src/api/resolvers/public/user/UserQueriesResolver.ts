import {Args, ArgsType, Field, Query, Resolver} from 'type-graphql';
import {User} from '~/api/resolvers';
import {Inject} from 'typedi';
import {UsersController} from '~/shared/controllers';
import {UseContext, Context, CurrentUser, UseCurrentUser} from '~/api/decorators';

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

  // @Query(() => User, {
  //   description: 'Returns information about current user',
  // })
  // user(): User {
  //   return new User(user);
  // }

  @Query(() => String, {
    description: 'Authenticates user and returns token with default ' +
      'access scopes'
  })
  login(
    @UseCurrentUser() user: CurrentUser,
    @UseContext() ctx: Context,
    @Args(() => LoginArgs) args: LoginArgs,
  ): string {
    console.log(ctx, user)
    // const {login, password} = args;
    // const user = this.controller.getByLoginAndPassword(login, password);
    //
    // if (user === null) {
    //   throw new UserNotFoundError();
    // }
    // return this.accessController.createDefaultUserToken(user.id);
    return ''
  }
}
