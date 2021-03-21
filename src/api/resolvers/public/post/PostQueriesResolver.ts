import {Arg, Int, Maybe, Query, Resolver} from 'type-graphql';
import {Post} from '~/api/resolvers';
import {Inject} from 'typedi';
import {PostsController} from '~/shared/controllers';
import {ObjectIdScalar} from '~/api/scalars';
import {ObjectId} from 'bson';

@Resolver()
export class PostQueriesResolver {
  @Inject(() => PostsController)
  controller: PostsController;

  @Query(() => Post, {
    description: 'Returns post by id',
    nullable: true
  })
  async post(
    @Arg('postId', () => ObjectIdScalar, {description: 'Post identifier'}) postId: ObjectId,
  ): Promise<Maybe<Post>> {
    const post = await this.controller.findById(postId);

    if (post === null) {
      return null;
    }
    return new Post(post);
  }
}