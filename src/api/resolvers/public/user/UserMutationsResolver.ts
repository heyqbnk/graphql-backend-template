import {
  Args,
  ArgsType,
  Field,
  Maybe,
  Mutation,
  ObjectType,
  Resolver
} from 'type-graphql';
import {User} from '~/api/resolvers';
import {IsAlphanumeric, MaxLength, MinLength} from 'class-validator';
import {Inject} from 'typedi';
import {AccessController, UsersController} from '~/shared/controllers';
import {UserIsAlreadyRegisteredError} from '~/api/errors';

@ArgsType()
class RegisterArgs {
  @MinLength(1)
  @MaxLength(30)
  @Field(() => String, {description: 'First name'})
  firstName: string;

  @MinLength(1)
  @MaxLength(30)
  @Field(() => String, {description: 'Last name', nullable: true})
  lastName?: Maybe<string>;

  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(32)
  @Field(() => String, {description: 'Login'})
  login: string;

  @MinLength(3)
  @MaxLength(100)
  @Field(() => String, {description: 'Password'})
  password: string;
}

@ObjectType()
class RegisterResult {
  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }

  @Field(() => User, {description: 'User information'})
  user: User;

  @Field(() => String, {description: 'Access token'})
  token: string;
}

@Resolver()
export class UserMutationsResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  @Inject(() => AccessController)
  accessController: AccessController;

  @Mutation(() => RegisterResult)
  register(
    @Args(() => RegisterArgs) arg: RegisterArgs
  ): RegisterResult {
    const {firstName, lastName, login, password} = arg;

    try {
      const user = this.controller.register({
        firstName,
        lastName: lastName || undefined,
        login,
        password,
      });
      const token = this
        .accessController
        .createDefaultUserToken(user.id);

      return new RegisterResult(new User(user), token);
    } catch (e) {
      throw new UserIsAlreadyRegisteredError();
    }
  }
}