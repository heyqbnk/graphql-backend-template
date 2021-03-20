import {Arg, Int, Maybe, Query, Resolver} from 'type-graphql';
import {Post} from '~/api/resolvers';
import {Inject} from 'typedi';
import {PostsController} from '~/shared/controllers';

@Resolver()
export class PostQueriesResolver {
  @Inject(() => PostsController)
  controller: PostsController;

  @Query(() => Post, {
    description: 'Returns post by id',
    nullable: true
  })
  post(
    @Arg('postId', () => Int, {description: 'Post identifier'}) postId: number,
  ): Maybe<Post> {
    const post = this.controller.getById(postId);

    if (post === null) {
      return null;
    }
    return new Post(post);
  }
}