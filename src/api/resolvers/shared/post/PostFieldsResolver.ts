import {FieldResolver, Resolver, ResolverInterface, Root} from 'type-graphql';
import {Post, User} from '~/api/resolvers';
import {UsersController} from '~/shared/controllers';
import {Inject} from 'typedi';
import {UserNotFoundError} from '~/api/errors';

@Resolver(() => Post)
export class PostFieldsResolver implements ResolverInterface<Post> {
  @Inject(() => UsersController)
  usersController: UsersController;

  @FieldResolver()
  user(@Root() post: Post) {
    const user = this.usersController.getById(post.userId);

    if (user === null) {
      throw new UserNotFoundError();
    }
    return new User(user);
  }
}