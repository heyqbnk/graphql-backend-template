import {EAccessScope} from '~/shared/types/enums';

/**
 * Content of JWT payload given to user.
 */
export interface IUserJWTPayload {
  /**
   * User unique identifier.
   */
  id: number;
  /**
   * States if user is admin.
   */
  scopes: EAccessScope[];
}