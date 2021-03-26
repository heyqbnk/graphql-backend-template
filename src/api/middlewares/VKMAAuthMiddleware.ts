import {MiddlewareFn} from 'type-graphql';
import {
  TAppSecurityAdapterProducedContext,
} from '~/shared/types';
import {IVKMAHttpContext, verifyLaunchParams} from '~/api/security-adapters';
import {AuthorizationError, LaunchParametersExpiredError} from '~/api/errors';

/**
 * VK Mini Apps auth middleware which checks if launch parameters passed in
 * context were given by one of our applications.
 */
export const VKMAAuthMiddleware: MiddlewareFn<IVKMAHttpContext> = ({context}, next) => {
  const {launchParamsQuery} = context;
  const verificationResult = verifyLaunchParams(launchParamsQuery);

  if (verificationResult === 'not-valid') {
    throw new AuthorizationError;
  }
  if (verificationResult === 'expired') {
    throw new LaunchParametersExpiredError;
  }
  (context as TAppSecurityAdapterProducedContext).launchParams = verificationResult;

  return next();
};