import {createError} from './utils';
import {EApolloErrors} from './types';

export const AuthorizationError = createError(EApolloErrors.Authorization, 'Authorization required');
export const BadParametersError = createError(EApolloErrors.BadParameters, 'Плохие параметры');
export const ForbiddenError = createError(EApolloErrors.Forbidden, 'Access denied');
export const MissingScopeError = createError(EApolloErrors.MissingScope, 'Required scope is missing');
export const UnknownError = createError(EApolloErrors.Unknown, 'Произошла неизвестная ошибка');
export const UserNotFoundError = createError(EApolloErrors.UserNotFound, 'User was not found');
export const UserIsAlreadyRegisteredError = createError(EApolloErrors.UserIsAlreadyRegistered, 'User is already registered');
