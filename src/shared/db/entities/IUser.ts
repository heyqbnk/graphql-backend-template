import {EUserRole} from '~/shared/types';
import {IDocument} from '~/shared/db';

export interface IUser extends IDocument {
  vkUserId?: number;
  firstName: string;
  lastName?: string;
  login: string;
  password: string;
  role: EUserRole;
}