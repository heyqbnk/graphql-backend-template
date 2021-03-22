/**
 * List of errors server could return.
 */
export enum EApolloErrors {
  Authorization = 'Authorization',
  BadParameters = 'BadParameters',
  Forbidden = 'Forbidden',
  Schema = 'Schema',
  MissingScope = 'MissingScope',
  LaunchParametersExpired = 'LaunchParametersExpired',
  NotFound = 'NotFound',
  Unknown = 'Unknown',
  UserNotFound = 'UserNotFound',
  UserIsAlreadyRegistered = 'UserIsAlreadyRegistered',
  Validation = 'Validation',
}
