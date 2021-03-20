import {createMethodDecorator} from 'type-graphql';
import {EUserRole} from '~/shared/types';
import {TAnyContext} from '~/api/types';
import {
  AuthorizationError,
  UserNotFoundError, ForbiddenError
} from '~/api/errors';
import {isObject} from '~/shared/utils';
import {Container} from 'typedi';
import {UsersController} from '~/shared/controllers';

/**
 * Checks if current client has all required roles.
 * @constructor
 * @param role
 */
export function RequireRole(role: EUserRole | {oneOf: EUserRole[]}) {
  return createMethodDecorator<TAnyContext>(async ({context}, next) => {
    if (!('user' in context)) {
      throw new AuthorizationError();
    }
    const usersController = Container.get(UsersController);
    const user = usersController.getById(context.user.id);

    if (!user) {
      throw new UserNotFoundError();
    }
    let hasRole = false;

    if (isObject(role)) {
      for (const r of role.oneOf) {
        if (user.role === r) {
          hasRole = true;
          break;
        }
      }
    } else {
      hasRole = user.role === role;
    }

    if (!hasRole) {
      throw new ForbiddenError();
    }
    await next();
  });
}