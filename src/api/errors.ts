import {EApolloErrors} from './types';

/**
 * Creates throwable error class.
 * @param {string} name
 * @param {string} defaultMessage
 * @returns {{new(message?: string): {name: string, message: string, stack?: string}, (message?: string): Error, readonly prototype: Error}}
 */
function createError(name: string, defaultMessage: string) {
  return class extends Error {
    constructor(message?: string) {
      super(message || defaultMessage);
      this.name = name;
    }
  };
}

export const AuthorizationError = createError(EApolloErrors.Authorization, 'Authorization required');
export const BadParametersError = createError(EApolloErrors.BadParameters, 'Bad parameters');
export const ForbiddenError = createError(EApolloErrors.Forbidden, 'Access denied');
export const LaunchParametersExpiredError = createError(EApolloErrors.LaunchParametersExpired, 'Launch parameters expired');
export const MissingScopeError = createError(EApolloErrors.MissingScope, 'Required scope is missing');
export const UnknownError = createError(EApolloErrors.Unknown, 'Unknown error occurred');
export const UserNotFoundError = createError(EApolloErrors.UserNotFound, 'User was not found');
export const UserIsAlreadyRegisteredError = createError(EApolloErrors.UserIsAlreadyRegistered, 'User is already registered');
