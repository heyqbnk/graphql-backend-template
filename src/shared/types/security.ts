import {ObjectId} from 'bson';
import {EUserRole} from '~/shared/types';

export interface IUserToken {
  /**
   * User identifier.
   */
  id: ObjectId;
  /**
   * User role.
   */
  role: EUserRole;
}