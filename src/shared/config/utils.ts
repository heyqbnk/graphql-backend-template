import {TAppEnvironment} from '~/shared/types';
import {isBoolean, isString, isUndefined} from '~/shared/utils';
import {IVKAppCredentials} from '~/shared/config/types';

interface IGetStringOptions {
  defaultValue?: string;
}

interface IGetNumberOptions {
  defaultValue?: number;
  type?: 'negative' | 'positive';
}

interface IGetBooleanOptions {
  defaultValue?: boolean;
}

interface IGetAppEnvironmentOptions {
  defaultValue?: TAppEnvironment;
}

interface IGetAppCredentialsOptions {
  defaultValue?: IVKAppCredentials[];
}

/**
 * Creates error for specified environment variable.
 * @param {string} envName
 * @returns {Error}
 */
export function createError(envName: string) {
  return new Error(
    `Environment variable ${envName} was not passed or has incorrect format`,
  );
}

/**
 * Parses variable as number.
 * @param {string} variableName
 * @param {IGetNumberOptions} options
 * @returns {number}
 */
export function getNumber(
  variableName: string,
  options: IGetNumberOptions = {},
): number {
  const {defaultValue, type} = options;
  const value = Number(process.env[variableName]);

  if (
    Number.isNaN(value) ||
    (type === 'negative' && value >= 0) ||
    (type === 'positive' && value <= 0)
  ) {
    if (isUndefined(defaultValue)) {
      throw createError(variableName);
    }
    return defaultValue;
  }
  return value;
}

/**
 * Parses variable as string.
 * @param {string} variableName
 * @param {IGetStringOptions} options
 * @returns {string}
 */
export function getString(
  variableName: string,
  options: IGetStringOptions = {},
): string {
  const {defaultValue} = options;
  const value = process.env[variableName];

  if (isString(value)) {
    return value;
  }
  if (isString(defaultValue)) {
    return defaultValue;
  }
  throw createError(variableName);
}

/**
 * Parses variable as boolean.
 * @param variableName
 * @param options
 */
export function getBoolean(
  variableName: string,
  options: IGetBooleanOptions = {},
): boolean {
  const {defaultValue} = options;
  const value = process.env[variableName];

  if (isString(value)) {
    return value === '1';
  }
  if (isBoolean(defaultValue)) {
    return defaultValue;
  }
  throw createError(variableName);
}

/**
 * Parses variable as application environment.
 * @param {string} variableName
 * @param {IGetAppEnvironmentOptions} options
 * @returns {TAppEnvironment}
 */
export function getAppEnvironment(
  variableName: string,
  options: IGetAppEnvironmentOptions = {},
): TAppEnvironment {
  const {defaultValue} = options;
  const value = process.env[variableName];

  if (isString(value)) {
    if (['local', 'staging', 'production'].includes(value)) {
      return value as TAppEnvironment;
    }
    throw createError(variableName);
  }
  if (isString(defaultValue)) {
    return defaultValue;
  }
  throw createError(variableName);
}

/**
 * Parses variable as VK application credentials.
 * @param {string} variableName
 * @param options
 * @returns {IVKAppCredentials[]}
 */
export function getVKAppCredentials(
  variableName: string,
  options: IGetAppCredentialsOptions = {},
): IVKAppCredentials[] {
  const {defaultValue} = options;
  const value = process.env[variableName];

  if (isString(value)) {
    const parsed = value.split(',').map(cred => {
      const [appIdStr, secretKey = ''] = cred.split(':');
      const appId = Number(appIdStr);

      if (Number.isNaN(appId) || secretKey.length === 0) {
        throw createError(variableName);
      }
      return {appId, secretKey};
    });

    if (parsed.length === 0) {
      throw createError(variableName);
    }
    return parsed;
  }
  if (!isUndefined(defaultValue)) {
    return defaultValue;
  }
  throw createError(variableName);
}