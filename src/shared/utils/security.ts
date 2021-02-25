import jwt from 'jsonwebtoken';
import {Container} from 'typedi';
import {ConfigToken} from '~/shared/di';
import {
  isArray,
  isBoolean,
  isNumber,
  isObject, isString,
  isUndefined
} from '~/shared/utils';
import {EAccessScope, IUserJWTPayload} from '~/shared/types';

const DAY_IN_S = 24 * 60 * 60;
const scopes = Object.values(EAccessScope);

/**
 * Creates JSON Web Token.
 * @param payload
 */
function createJWT(payload: object): string {
  // Create JSON Web Token with duration of 1 day.
  return jwt.sign(
    payload,
    Container.get(ConfigToken).jwtSecretKey,
    {expiresIn: DAY_IN_S}
  );
}

/**
 * Creates user JWT.
 * @param payload
 */
export function createUserJWT(payload: IUserJWTPayload): string {
  return createJWT(payload);
}

/**
 * Validates JSON Web Token returning payload or false in case token is not
 * valid.
 * @param token
 */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const payload = jwt.verify(token, Container.get(ConfigToken).jwtSecretKey);

    if (!isObject(payload)) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Checks if value is user JWT payload.
 * @param value
 */
function isUserJWTPayload(value: any): value is IUserJWTPayload {
  return isObject(value) &&
    // id
    isNumber(value.id) &&
    // scopes
    (isArray(value.scopes) && value.scopes.every(s => {
      return isString(s) && scopes.includes(s as EAccessScope);
    }));
}

/**
 * Decodes token and returns payload in case it is user JWT payload.
 * @param token
 */
export function decodeUserJWT(token: string): IUserJWTPayload | null {
  const payload = decodeJWT(token);

  if (payload === null || !isUserJWTPayload(payload)) {
    return null;
  }
  return payload;
}