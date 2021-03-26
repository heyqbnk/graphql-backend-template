import {ISecurityAdapter, TCreateContext, TGetUser} from '../types';
import {defaultFormatError} from '../shared';
import {Inject, Service} from 'typedi';
import {JWT} from '~/shared/services';
import {
  TJWTProducedContext,
  IJWTSocketContext,
  TJWTUser,
  TJWTHttpContext,
} from '~/api/security-adapters';
import {UsersController} from '~/shared/controllers';

/**
 * JSON Web Token security adapter.
 */
@Service()
export class JWTSecurityAdapter
  implements ISecurityAdapter<IJWTSocketContext,
    TJWTHttpContext,
    TJWTProducedContext,
    TJWTUser> {
  @Inject(() => JWT)
  jwt: JWT;

  @Inject(() => UsersController)
  usersController: UsersController;

  formatError = defaultFormatError;

  onConnect(connectionParams: Record<any, any>): IJWTSocketContext {
    return {
      token: (connectionParams['authorization'] || '').split(' ')[1] || null,
    };
  }

  createContext: TCreateContext<IJWTSocketContext, TJWTHttpContext> =
    expressContext => {
      const {req, connection} = expressContext;
      let context: TJWTProducedContext;

      // In case, connection is undefined, it means, context is being created in
      // usual HTTP resolver.
      if (connection === undefined) {
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

  getUser: TGetUser<TJWTProducedContext, TJWTUser> = async context => {
    return 'user' in context
      ? this.usersController.findById(context.user.id)
      : null;
  };
}