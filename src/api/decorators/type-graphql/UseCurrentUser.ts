import {createParamDecorator} from 'type-graphql';
import {UserNotFoundError} from '~/api/errors';
import {Container} from 'typedi';
import {
  TAppSecurityAdapterProducedContext,
  TAppSecurityAdapterUser,
} from '~/shared/types';
import {SecurityAdapterToken} from '~/shared/di';

/**
 * Returns current user based on context.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function UseCurrentUser() {
  return createParamDecorator<TAppSecurityAdapterProducedContext>(async ({context}) => {
    const securityAdapter = Container.get(SecurityAdapterToken);
    const user = await securityAdapter.getUser(context);

    if (user === null) {
      throw new UserNotFoundError();
    }
    return user;
  });
}

export {TAppSecurityAdapterUser as CurrentUser};