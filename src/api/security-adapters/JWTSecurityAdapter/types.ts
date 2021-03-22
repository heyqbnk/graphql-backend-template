import {IUser} from '~/shared/db';
import {IUserToken} from '~/shared/types';

export interface IJWTSocketContext {
  /**
   * Client JSON Web token.
   */
  token: string | null;
}

export interface IJWTAuthorizedContext extends IJWTSocketContext {
  /**
   * Token is required in authorized context.
   */
  token: string;
  /**
   * User received from token.
   */
  user: IUserToken;
}

export type TJWTProducedContext = IJWTSocketContext | IJWTAuthorizedContext;
export type TJWTUser = IUser;