import {ISecurityAdapter, TCreateContext, TGetUser} from '../types';
import {defaultFormatError} from '../shared';
import {Inject, Service} from 'typedi';
import qs from 'querystring';
import {
  IVKMAProducedContext, IVKMASocketContext, TVKMAUser,
} from './types';
import {AuthorizationError, LaunchParametersExpiredError} from '~/api/errors';
import {verifyLaunchParams} from '~/api/security-adapters/VKMASecurityAdapter/utils';
import {UsersController} from '~/shared/controllers';

/**
 * VK Mini Apps security adapter.
 */
@Service()
export class VKMASecurityAdapter
  implements ISecurityAdapter<IVKMASocketContext,
    IVKMAProducedContext,
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

  createContext: TCreateContext<IVKMASocketContext, IVKMAProducedContext> =
    expressContext => {
      const {req, connection} = expressContext;

      if (connection === undefined) {
        const launchParamsQuery = qs.parse(req.header('authorization') || '');
        const verificationResult = verifyLaunchParams(launchParamsQuery);

        if (verificationResult === 'not-valid') {
          throw new AuthorizationError;
        }
        if (verificationResult === 'expired') {
          throw new LaunchParametersExpiredError;
        }
        return {launchParamsQuery, launchParams: verificationResult};
      }
      return connection.context;
    };

  getUser: TGetUser<IVKMAProducedContext, TVKMAUser> = context => {
    return this.usersController.findByUserId(context.launchParams.userId);
  };
}