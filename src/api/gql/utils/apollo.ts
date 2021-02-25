import {buildSchemaSync, BuildSchemaOptions} from 'type-graphql';
import {ApolloServer, ExpressContext} from 'apollo-server-express';
import {SentryMiddleware} from '~/api/gql/middlewares';
import {Container} from 'typedi';
import {ContextFunction} from 'apollo-server-core';
import {decodeUserJWT, isString, isUndefined} from '~/shared/utils';
import {PubSub} from '~/shared/services';
import {ConfigToken} from '~/shared/di';
import {
  getAdminResolvers,
  getPublicResolvers,
  getSharedResolvers
} from '~/api/gql/structures';
import {GraphQLError, GraphQLFormattedError} from 'graphql';
import {EApolloErrors, IAuthorizedContext, IContext} from '~/api/gql/types';

/**
 * Formats error occurred in resolver before sending it to client. Removes
 * some private fields.
 * @param error
 */
function formatError(
  error: GraphQLError
): { name: string } & GraphQLFormattedError {
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
    // Error thrown by Apollo GraphQL Server occurring when query sent by
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

/**
 * Creates context in Apollo Server.
 * @param {ExpressContext} options
 * @returns {any}
 */
const context: ContextFunction<ExpressContext, IContext | IAuthorizedContext> =
  options => {
    const {req, connection} = options;
    let context: IContext | IAuthorizedContext;

    // In case, connection is undefined, it means, context is being created in
    // usual HTTP resolver.
    if (isUndefined(connection)) {
      context = {
        token: (req.header('authorization') || '').split(' ')[1] || null,
      };
    } else {
      // Otherwise, we are in websocket context. Context was created previously in
      // "onConnect" method.
      context = connection.context;
    }
    const {token} = context;

    if (token !== null) {
      const payload = decodeUserJWT(token);

      if (payload !== null) {
        return {...context, user: payload};
      }
    }
    return context;
  };

/**
 * Function which is called while web socket connection to server is being
 * created. As a result, it should return context value.
 * @param {Record<any, any>} connectionParams
 * @returns {IContext}
 */
function onConnect(connectionParams: Record<any, any>): IContext {
  return {
    token: (connectionParams['authorization'] || '').split(' ')[1] || null
  };
}

/**
 * Creates apollo server with specified options.
 * @returns {ApolloServer}
 * @param schemaOptions
 */
function createServer(
  schemaOptions: BuildSchemaOptions & { subscriptionsPath?: string },
): ApolloServer {
  const {
    globalMiddlewares = [SentryMiddleware],
    container = Container,
    subscriptionsPath,
    ...restSchemaOptions
  } = schemaOptions;
  const schema = buildSchemaSync({
    ...restSchemaOptions,
    globalMiddlewares,
    container,
    pubSub: subscriptionsPath ? Container.get(PubSub) : undefined,
  });
  const isNotLocal = Container.get(ConfigToken).appEnv !== 'local';

  return new ApolloServer({
    context,
    schema,
    subscriptions: isString(subscriptionsPath) ? {
      path: subscriptionsPath,
      onConnect,
    } : false,
    formatError,
    // We block introspection query and playground on staging and production
    // environments for security reasons.
    introspection: !isNotLocal,
    playground: !isNotLocal,
  });
}

/**
 * Creates Apollo Server for specified access scope.
 * @param type
 */
export function createApolloServer(
  type: 'public' | 'admin'
): ApolloServer {
  const config = Container.get(ConfigToken);
  const getResolvers = type === 'public'
    ? getPublicResolvers : getAdminResolvers;
  const wsPath = type === 'public'
    ? config.gqlPublicWSEndpoint : config.gqlAdminWSEndpoint;

  return createServer({
    resolvers: [...getSharedResolvers(), ...getResolvers()],
    subscriptionsPath: wsPath || undefined,
  });
}