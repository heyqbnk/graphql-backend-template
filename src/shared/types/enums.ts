/**
 * List of access scopes which could be given to user.
 */
export enum EAccessScope {
  /**
   * Allows to read current user information.
   */
  ReadUserInfo = 'RegisterUser',
  /**
   * Allows to create new posts.
   */
  CreatePost = 'CreatePost',
}

/**
 * List of roles which could be assigned to user.
 */
export enum EUserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  Editor = 'Editor',
  Common = 'Common',
}