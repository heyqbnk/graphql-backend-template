import {IUser} from '~/shared/db';
import {IUserToken} from '~/shared/types';

export interface IJWTSocketContext {
  /**
   * Client JSON Web token.
   */
  token: string | null;
}

export type TJWTHttpContext = {
  /**
   * Token is required in authorized context.
   */
  token: string;
  /**
   * User received from token.
   */
  user: IUserToken;
} | IJWTSocketContext;

export type TJWTProducedContext = IJWTSocketContext | TJWTHttpContext;
export type TJWTUser = IUser;