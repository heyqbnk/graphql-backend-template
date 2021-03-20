import {
  Arg,
  Args,
  ArgsType,
  Field,
  Int,
  Mutation,
  Resolver
} from 'type-graphql';
import {Post} from '~/api/resolvers';
import {RequireScope, CurrentUser, UseCurrentUser} from '~/api/decorators';
import {EAccessScope} from '~/shared/types';
import {MaxLength, MinLength} from 'class-validator';
import {Inject} from 'typedi';
import {PostsController} from '~/shared/controllers';

@ArgsType()
class CreatePostArgs {
  @MinLength(3)
  @MaxLength(300)
  @Field(() => String, {description: 'Title'})
  title: string;

  @MinLength(100)
  @MaxLength(1000)
  @Field(() => String, {description: 'Content'})
  content: string;
}

@Resolver()
export class PostMutationsResolver {
  @Inject(() => PostsController)
  controller: PostsController;

  @RequireScope(EAccessScope.CreatePost)
  @Mutation(() => Post, {
    description: 'Creates new user post'
  })
  createPost(
    @UseCurrentUser() user: CurrentUser,
    @Args(() => CreatePostArgs) args: CreatePostArgs,
  ): Post {
    const {title, content} = args;
    const post = this.controller.create({title, content, userId: user.id});

    return new Post(post);
  }

  @Mutation(() => Post)
  deletePost(
    @UseCurrentUser() user: CurrentUser,
    @Arg('postId', () => Int, {
      description: 'Post identifier'
    }) postId: number,
  ): boolean {
    return this.controller.delete(postId, user.id);
  }
}