import {IUser} from '~/shared/db';

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
}

export type TJWTProducedContext = IJWTSocketContext | IJWTAuthorizedContext;
export type TJWTUser = IUser;