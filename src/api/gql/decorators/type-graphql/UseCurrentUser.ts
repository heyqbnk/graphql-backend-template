import {createParamDecorator} from 'type-graphql';
import {IAuthorizedContext} from '../../types';
import {UserNotFoundError} from '~/api/gql/errors';
import {Container} from 'typedi';
import {UsersController} from '~/shared/controllers';
import {IUser} from '~/shared/types';

/**
 * Возвращает текущего пользователя в случае, если он зарегистрирован.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function UseCurrentUser() {
  return createParamDecorator<IAuthorizedContext>(async ({context}) => {
    if (!('user' in context)) {
      throw new UserNotFoundError();
    }
    const usersController = Container.get(UsersController);
    const user = usersController.getById(context.user.id);

    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  });
}

export {IUser as CurrentUser};
