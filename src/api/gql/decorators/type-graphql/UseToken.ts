import {createParamDecorator} from 'type-graphql';
import {TAnyContext} from '../../types';
import {EAccessScope} from '~/shared/types';
import {UserNotFoundError} from '~/api/gql/errors';

interface IToken {
  token: string;
  userId: number;
  scopes: EAccessScope[];
}

/**
 * Returns JWT information.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function UseToken() {
  return createParamDecorator<TAnyContext>(({context}) => {
    if (!('user' in context)) {
      throw new UserNotFoundError();
    }
    const {id, scopes} = context.user;

    return {
      userId: id,
      scopes,
      token: context.token,
    }
  });
}

export {IToken as Token};
