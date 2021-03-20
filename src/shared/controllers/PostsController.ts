import {Inject, Service} from 'typedi';
import {IPost} from '~/shared/db';
import {UsersController} from '~/shared/controllers/UsersController';

interface ICreateData {
  userId: number;
  title: string;
  content: string;
}

@Service()
export class PostsController {
  @Inject(() => UsersController)
  usersController: UsersController;

  private posts: IPost[] = [{
    id: 0,
    userId: 0,
    title: 'First admin post',
    content: 'Lorem ipsum dolor sit amet',
    createdAt: new Date(),
  }];

  /**
   * Returns user posts.
   * @param userId
   */
  getUserPosts(userId: number): IPost[] {
    return this.posts.filter(p => p.userId === userId && !('deletedAt' in p));
  }

  /**
   * Returns post by id.
   * @param id
   */
  getById(id: number): IPost | null {
    return this.posts.find(p => p.id === id) || null;
  }

  /**
   * Creates new post.
   * @param data
   */
  create(data: ICreateData): IPost {
    const {content, title, userId} = data;

    if (!this.usersController.isRegistered(userId)) {
      throw new Error('User was not found');
    }
    this.posts.push({
      id: this.posts.length,
      userId,
      title,
      content,
      createdAt: new Date(),
    });

    return this.posts[this.posts.length - 1];
  }

  /**
   * Deletes post with soft deletion.
   * @param id
   * @param userId
   */
  delete(id: number, userId: number): boolean {
    for (const post of this.posts) {
      if (post.id === id) {
        if (post.userId !== userId) {
          return false;
        }
        if ('deletedAt' in post) {
          return false;
        }
        post.deletedAt = new Date();
        return true;
      }
    }
    return false;
  }
}