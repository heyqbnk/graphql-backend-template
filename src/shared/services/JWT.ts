import {Inject, Service} from 'typedi';
import {ConfigToken} from '~/shared/di';
import {IConfig} from '~/shared/config';
import jwt from 'jsonwebtoken';
import {EUserRole} from '~/shared/types';
import {isArray, isNumber, isObject, isString} from '~/shared/utils';

interface IUserToken {
  /**
   * User identifier.
   */
  id: number;
  /**
   * List of user roles.
   */
  roles: EUserRole[];
}

/**
 * Count of seconds in one day.
 */
const DAY_IN_S = 24 * 60 * 60;

/**
 * List of existing roles.
 */
const roles = Object.values(EUserRole);

/**
 * Class which manipulates data with usage of json web tokens.
 */
@Service()
export class JWT {
  @Inject(ConfigToken)
  config: IConfig;

  /**
   * Returns true in case value is user token.
   * @param value
   */
  static isUserToken(value: any): value is IUserToken {
    return isObject(value) &&
      // id
      isNumber(value.id) &&
      // roles
      (isArray(value.roles) && value.roles.every(item => {
        return isString(item) && roles.includes(item as EUserRole);
      }));
  }

  /**
   * Creates json web token.
   * @param payload
   * @param expiresIn
   */
  private create(payload: object, expiresIn = DAY_IN_S): string {
    return jwt.sign(
      payload,
      this.config.jwtSecretKey,
      {expiresIn}
    )
  }

  /**
   * Verifies passed token returning its content.
   * @param token
   */
  private verify(token: string): Record<string, unknown> | null {
    try {
      const payload = jwt.verify(token, this.config.jwtSecretKey);

      if (!isObject(payload)) {
        return null;
      }
      return payload;
    } catch (e) {
      return null;
    }
  }

  /**
   * Creates user JSON web token.
   * @param payload
   */
  createUserToken(payload: IUserToken): string {
    return this.create(payload);
  }

  /**
   * Verifies token and returns it in case it is user token.
   * @param token
   */
  verifyUserToken(token: string): IUserToken | null {
    const payload = this.verify(token);

    return JWT.isUserToken(payload) ? payload : null;
  }
}