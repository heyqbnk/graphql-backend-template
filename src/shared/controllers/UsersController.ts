import {EUserRole} from '~/shared/types';
import {IUser} from '~/shared/db';
import {Service} from 'typedi';

interface IRegisterOptions {
  firstName: string;
  lastName?: string;
  login: string;
  password: string;
}

@Service()
export class UsersController {
  private users: IUser[] = [{
    id: 0,
    firstName: 'admin',
    login: 'admin',
    password: 'admin',
    role: EUserRole.Admin,
  }];

  /**
   * Register new user.
   * @param options
   */
  register(options: IRegisterOptions): IUser {
    const {firstName, lastName, login, password} = options;
    const loweredLogin = login.toLowerCase();
    const isRegistered = this.users.some(u => {
      return u.login.toLowerCase() === loweredLogin;
    });

    if (isRegistered) {
      throw new Error('User is already registered');
    }

    this.users.push({
      id: this.users.length,
      firstName,
      lastName,
      login,
      password,
      role: EUserRole.Common,
    });

    return this.users[this.users.length - 1];
  }

  /**
   * Returns user by login and password.
   * @param login
   * @param password
   */
  getByLoginAndPassword(login: string, password: string): IUser | null {
    return this
      .users
      .find(u => u.login === login && u.password === password) || null;
  }

  /**
   * Returns user by id.
   * @param id
   */
  getById(id: number): IUser | null {
    return this
      .users
      .find(u => u.id === id) || null;
  }

  /**
   * Checks if user is registered.
   * @param id
   */
  isRegistered(id: number): boolean {
    return this.users.some(u => u.id === id);
  }

  /**
   * Updates user role.
   * @param id
   * @param role
   */
  setUserRole(id: number, role: EUserRole): IUser | null {
    for (const user of this.users) {
      if (user.id === id) {
        if (user.role === role) {
          return user;
        }
        user.role = role;

        return user;
      }
    }
    return null;
  }
}