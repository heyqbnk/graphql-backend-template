/**
 * Post.
 */
export interface IPost {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  deletedAt?: Date;
}