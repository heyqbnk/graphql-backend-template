import {GraphQLError, GraphQLFormattedError} from 'graphql';
import {EApolloErrors} from '~/api/types';

/**
 * Default error formatter.
 * @param error
 */
export function defaultFormatError(
  error: GraphQLError,
): {name: string} & GraphQLFormattedError {
  const {name, extensions, path, message} = error;

  // Error thrown by Type GraphQL in Authorized decorator.
  if (message.startsWith('Access denied!')) {
    return {
      name: EApolloErrors.Forbidden,
      message,
      path,
    };
  }
  // Validation error thrown by class-validator.
  else if (extensions?.exception && 'validationErrors' in extensions.exception) {
    return {
      name: EApolloErrors.Validation,
      message,
      path,
      extensions: {
        exception: extensions?.exception.validationErrors,
      },
    };
  }
    // Error thrown by Apollo GraphQL HttpServer occurring when query sent by
  // client is incorrect.
  else if (name === 'ValidationError') {
    return {
      name: EApolloErrors.Schema,
      message,
      path,
    };
  }
    // Error thrown in our code in some resolver. In case, error name is unknown,
  // use "UnknownError".
  else if (name === 'GraphQLError') {
    return {
      name: extensions?.exception?.name || EApolloErrors.Unknown,
      message,
      path,
    };
  }
  // Unknown error.
  return {name, path, message};
}