import {
  FieldResolver,
  Resolver,
  ResolverInterface, Root,
} from 'type-graphql';
import {Post, User} from '~/api/resolvers';
import {Inject} from 'typedi';
import {PostsController} from '~/shared/controllers';

@Resolver(() => User)
export class UserFieldsResolver implements ResolverInterface<User> {
  @Inject(() => PostsController)
  postsController: PostsController;

  @FieldResolver()
  posts(@Root() user: User) {
    return this
      .postsController
      .getUserPosts(user.id)
      .then(items => items.map(p => new Post(p)));
  }
}