import {EUserRole} from '~/shared/types';

/**
 * Project user.
 */
export interface IUser {
  id: number;
  firstName: string;
  lastName?: string;
  login: string;
  password: string;
  role: EUserRole;
}