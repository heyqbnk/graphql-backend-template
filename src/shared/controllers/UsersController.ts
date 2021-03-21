import {EUserRole} from '~/shared/types';
import {ECollection, IUser} from '~/shared/db';
import {Service} from 'typedi';
import {BaseController} from '~/shared/controllers/BaseController';
import md5 from 'md5';
import {ObjectId} from 'bson';

interface IRegisterOptions {
  firstName: string;
  lastName?: string;
  login: string;
  password: string;
  role: EUserRole;
}

type TRegisterResult = 'User already exists' | IUser;

@Service()
export class UsersController extends BaseController(ECollection.Users) {
  findById = this.db.findById;

  /**
   * Register new user. In case, user already exists, returns error.
   * @param options
   */
  async register(options: IRegisterOptions): Promise<TRegisterResult> {
    const {login} = options;
    const createdUser = await this.db.findOne({login});

    if (createdUser !== null) {
      return 'User already exists';
    }
    const {password, ...rest} = options;

    return this.db.insertOne({
      ...rest,
      login,
      password: md5(password),
    });
  }

  /**
   * Sets new role for user.
   * @param userId
   * @param role
   */
  setUserRole(userId: ObjectId, role: EUserRole) {
    return this.db.updateById(userId, {$set: {role}});
  }
}