/**
 * List of errors server could return.
 */
export enum EApolloErrors {
  Authorization = 'AuthorizationError',
  BadParameters = 'BadParametersError',
  Forbidden = 'ForbiddenError',
  Schema = 'SchemaError',
  MissingScope = 'MissingScopeError',
  NotFound = 'NotFoundError',
  Unknown = 'UnknownError',
  UserNotFound = 'UserNotFoundError',
  UserIsAlreadyRegistered = 'UserIsAlreadyRegisteredError',
  Validation = 'ValidationError',
}
