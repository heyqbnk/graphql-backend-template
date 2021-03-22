import {ISecurityAdapter, TCreateContext, TGetUser} from '../types';
import {defaultFormatError} from '../shared';
import {isUndefined} from '~/shared/utils';
import {Inject, Service} from 'typedi';
import {JWT} from '~/shared/services';
import {
  TJWTProducedContext,
  IJWTSocketContext,
  TJWTUser,
} from '~/api/security-adapters';

/**
 * JSON Web Token security adapter.
 */
@Service()
export class JWTSecurityAdapter
  implements ISecurityAdapter<IJWTSocketContext,
    TJWTProducedContext,
    TJWTUser> {
  @Inject(() => JWT)
  jwt: JWT;

  formatError = defaultFormatError;

  onConnect(connectionParams: Record<any, any>): IJWTSocketContext {
    return {
      token: (connectionParams['authorization'] || '').split(' ')[1] || null,
    };
  }

  createContext: TCreateContext<IJWTSocketContext, TJWTProducedContext> =
    expressContext => {
      const {req, connection} = expressContext;
      let context: TJWTProducedContext;

      // In case, connection is undefined, it means, context is being created in
      // usual HTTP resolver.
      if (isUndefined(connection)) {
        context = {
          token: (req.header('authorization') || '').split(' ')[1] || null,
        };
      } else {
        // Otherwise, we are in websocket context. Context was created previously in
        // "onConnect" method.
        context = connection.context;
      }
      const {token} = context;

      if (token !== null) {
        const payload = this.jwt.verifyUserToken(token);

        if (payload !== null) {
          return {...context, user: payload};
        }
      }
      return context;
    };

  getUser: TGetUser<TJWTProducedContext, TJWTUser> = context => {
    return {
      id: 1,
    } as any;
    // return null;
  };
}