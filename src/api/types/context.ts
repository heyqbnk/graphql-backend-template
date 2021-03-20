import {IUserJWTPayload} from '~/shared/types';

export interface IContext {
  /**
   * Client JSON Web token.
   */
  token: string | null;
}

export interface IAuthorizedContext extends IContext {
  /**
   * Token is required in authorized context.
   */
  token: string;
  /**
   * User information.
   */
  user: IUserJWTPayload;
}

export type TAnyContext = IContext | IAuthorizedContext;