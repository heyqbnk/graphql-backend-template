import {Inject, Service} from 'typedi';
import {ECollection, IPost} from '~/shared/db';
import {UsersController} from '~/shared/controllers/UsersController';
import {BaseController} from '~/shared/controllers/BaseController';
import {ObjectId} from 'bson';

interface ICreateData {
  userId: number;
  title: string;
  content: string;
}

@Service()
export class PostsController extends BaseController(ECollection.Posts) {
  @Inject(() => UsersController)
  usersController: UsersController;

  findById = this.db.findById;

  /**
   * Returns user posts.
   * @param userId
   */
  getUserPosts(userId: ObjectId): Promise<IPost[]> {
    return this.db.find({userId});
  }

  /**
   * Creates new post.
   * @param data
   */
  // create(data: ICreateData): IPost {
  //   const {content, title, userId} = data;
  //
  //   if (!this.usersController.isRegistered(userId)) {
  //     throw new Error('User was not found');
  //   }
  //   this.posts.push({
  //     id: this.posts.length,
  //     userId,
  //     title,
  //     content,
  //     createdAt: new Date(),
  //   });
  //
  //   return this.posts[this.posts.length - 1];
  // }

  // /**
  //  * Deletes post with soft deletion.
  //  * @param id
  //  * @param userId
  //  */
  // delete(id: number, userId: number): boolean {
  //   for (const post of this.posts) {
  //     if (post.id === id) {
  //       if (post.userId !== userId) {
  //         return false;
  //       }
  //       if ('deletedAt' in post) {
  //         return false;
  //       }
  //       post.deletedAt = new Date();
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}