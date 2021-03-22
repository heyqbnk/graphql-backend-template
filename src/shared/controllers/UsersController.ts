import {EUserRole} from '~/shared/types';
import {ECollection, IUser} from '~/shared/db';
import {Inject, Service} from 'typedi';
import {BaseController} from '~/shared/controllers/BaseController';
import md5 from 'md5';
import {ObjectId} from 'bson';
import {JWT} from '~/shared/services';

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
  @Inject(() => JWT)
  jwt: JWT;

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
    const {password, role, firstName, lastName} = options;

    return this.db.insertOne({
      role,
      firstName,
      lastName,
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

  /**
   * Authenticates user in case, he was found in database.
   * @param login
   * @param password
   */
  async login(login: string, password: string): Promise<string | null> {
    const passwordHash = md5(password);
    const user = await this.db.findOne({login, password: passwordHash});

    if (user === null) {
      return null;
    }
    return this.jwt.createUserToken({id: user._id, role: user.role});
  }
}