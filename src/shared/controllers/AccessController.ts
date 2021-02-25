import {EAccessScope} from '~/shared/types';
import {Service} from 'typedi';
import {createUserJWT} from '~/shared/utils';

@Service()
export class AccessController {
  /**
   * Creates user jwt.
   * @param id
   * @param scopes
   */
  createUserToken(id: number, scopes: EAccessScope[]): string {
    return createUserJWT({id, scopes});
  }

  /**
   * Creates default user token.
   * @param id
   */
  createDefaultUserToken(id: number): string {
    return this.createUserToken(id, [EAccessScope.ReadUserInfo]);
  }
}