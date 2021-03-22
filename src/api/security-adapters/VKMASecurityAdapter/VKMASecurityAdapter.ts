import {ISecurityAdapter, TCreateContext, TGetUser} from '../types';
import {defaultFormatError} from '../shared';
import {Service} from 'typedi';
import qs from 'querystring';
import {
  IVKMAProducedContext, IVKMASocketContext, TVKMAUser,
} from './types';
import {AuthorizationError, LaunchParametersExpiredError} from '~/api/errors';
import {verifyLaunchParams} from '~/api/security-adapters/VKMASecurityAdapter/utils';

/**
 * VK Mini Apps security adapter.
 */
@Service()
export class VKMASecurityAdapter
  implements ISecurityAdapter<IVKMASocketContext,
    IVKMAProducedContext,
    TVKMAUser> {
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
    return {
      id: 1,
    } as any;
    // return null;
  };
}