import {ISecurityAdapter, TCreateContext, TGetUser} from '../types';
import {defaultFormatError} from '../shared';
import {Inject, Service} from 'typedi';
import qs from 'querystring';
import {
  TVKMAProducedContext, IVKMASocketContext, TVKMAUser, IVKMAHttpContext,
} from './types';
import {AuthorizationError, LaunchParametersExpiredError} from '~/api/errors';
import {verifyLaunchParams} from './utils';
import {UsersController} from '~/shared/controllers';
import {VKMAAuthMiddleware} from '~/api/middlewares';

/**
 * VK Mini Apps security adapter.
 */
@Service()
export class VKMASecurityAdapter
  implements ISecurityAdapter<IVKMASocketContext,
    IVKMAHttpContext,
    TVKMAProducedContext,
    TVKMAUser> {
  @Inject(() => UsersController)
  usersController: UsersController;

  formatError = defaultFormatError;

  onConnect(connectionParams: Record<any, any>): IVKMASocketContext {
    const launchParamsQuery = qs.parse(connectionParams['authorization'] || '');
    const verificationResult = verifyLaunchParams(launchParamsQuery);

    // We should not allow to create web socket connection for non-authorized
    // clients.
    if (verificationResult === 'not-valid') {
      throw new AuthorizationError;
    }
    if (verificationResult === 'expired') {
      throw new LaunchParametersExpiredError;
    }
    return {launchParamsQuery, launchParams: verificationResult};
  }

  createContext: TCreateContext<IVKMASocketContext, IVKMAHttpContext> =
    expressContext => {
      const {req, connection} = expressContext;

      if (connection === undefined) {
        return {
          launchParamsQuery: qs.parse(req.header('authorization') || ''),
        };
      }
      return connection.context;
    };

  getUser: TGetUser<TVKMAProducedContext, TVKMAUser> = context => {
    return this.usersController.findByUserId(context.launchParams.userId);
  };

  middlewares = [VKMAAuthMiddleware];
}