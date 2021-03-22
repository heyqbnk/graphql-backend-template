import {
  Arg,
  Args,
  ArgsType,
  Field,
  Mutation,
  Resolver,
} from 'type-graphql';
import {User} from '~/api/resolvers';
import {IsAlphanumeric, MaxLength, MinLength} from 'class-validator';
import {Inject} from 'typedi';
import {UsersController} from '~/shared/controllers';
import {EUserRole} from '~/shared/types';
import {UserIsAlreadyRegisteredError, UserNotFoundError} from '~/api/errors';

@ArgsType()
class RegisterArgs {
  @MinLength(1)
  @MaxLength(30)
  @Field(() => String, {description: 'First name'})
  firstName: string;

  @MinLength(1)
  @MaxLength(30)
  @Field(() => String, {description: 'Last name'})
  lastName: string;

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

@Resolver()
export class UserMutationsResolver {
  @Inject(() => UsersController)
  controller: UsersController;

  @Mutation(() => User, {
    description: 'Registers new user'
  })
  async register(
    @Args(() => RegisterArgs) args: RegisterArgs,
  ): Promise<User> {
    const result = await this.controller.register({
      ...args,
      role: EUserRole.Common,
    });

    if (result === 'User already exists') {
      throw new UserIsAlreadyRegisteredError;
    }
    return new User(result);
  }
}