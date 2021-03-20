import {Container} from 'typedi';
import {GraphQLError, GraphQLFormattedError} from 'graphql';
import {EApolloErrors, IAuthorizedContext, IContext} from '../types';
import {ContextFunction} from 'apollo-server-core';
import {
  ExpressContext,
  ApolloServer as OriginalApolloServer,
} from 'apollo-server-express';
import {decodeUserJWT, isString, isUndefined} from '../../shared/utils';
import {
  BuildSchemaOptions,
  buildSchemaSync,
  registerEnumType,
} from 'type-graphql';
import {SentryMiddleware} from '~/api/middlewares';
import {PubSub} from '~/shared/services';
import {
  getAdminResolvers,
  getPublicResolvers,
  getSharedResolvers,
} from '~/api/resolvers';
import {ConfigToken} from '~/shared/di';
import {Server as HttpServer} from "http";
import {Router} from 'express';
import {EAccessScope, EUserRole} from '~/shared/types';

interface IConProps extends BuildSchemaOptions {
  /**
   * Path for subscriptions. If not specified, subscriptions will be unavailable/
   */
  subscriptionsPath?: string;
  /**
   * Should introspection queries be included. It is recommended to disable
   * this feature on servers created for admin routes, so other people
   * will not know what they can do with admin interface.
   * @default false
   */
  introspection?: boolean;
  /**
   * Should GraphQL Playground be included. You can enable this feature to
   * work with your server faster. For example, you could use this interface
   * instead using cli or something like that.
   *
   * Has influence on server performance due to sends static files while
   * opening server url where Playground is placed.
   * @default false
   */
  playground?: boolean;
}

export class ApolloServer {
  /**
   * Original apollo server.
   * @private
   */
  private server: OriginalApolloServer;
  /**
   * True in case enums registrations was already called.
   * @private
   */
  private static areEnumsRegistered = false;

  constructor(props: IConProps) {
    // Firstly, register enums.
    ApolloServer.registerEnums();

    // Then create server.
    const {
      globalMiddlewares = [SentryMiddleware],
      container = Container,
      subscriptionsPath,
      playground = false,
      introspection = false,
      ...restSchemaOptions
    } = props;
    const schema = buildSchemaSync({
      ...restSchemaOptions,
      globalMiddlewares,
      container,
      pubSub: subscriptionsPath ? Container.get(PubSub) : undefined,
    });

    this.server = new OriginalApolloServer({
      context: ApolloServer.createContext,
      formatError: ApolloServer.formatError,
      subscriptions: isString(subscriptionsPath) ? {
        path: subscriptionsPath,
        onConnect: ApolloServer.onConnect,
      } : false,
      schema,
      introspection,
      playground,
    });
  }

  /**
   * Formats error occurred in resolver before sending it to client.
   * Removes some private fields.
   * @param error
   */
  private static formatError = (
    error: GraphQLError,
  ): {name: string} & GraphQLFormattedError => {
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
  };

  /**
   * Context creator for Apollo resolvers.
   * @private
   */
  private static createContext: ContextFunction<ExpressContext, IContext | IAuthorizedContext> = options => {
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
   * @param connectionParams
   */
  private static onConnect = (
    connectionParams: Record<any, any>,
  ): IContext => {
    return {
      token: (connectionParams['authorization'] || '').split(' ')[1] || null,
    };
  };

  /**
   * Register all required GraphQL enums.
   */
  private static registerEnums() {
    if (!this.areEnumsRegistered) {
      registerEnumType(EAccessScope, {
        name: 'AccessScope',
        description: 'Access scopes which could be given to user'
      });
      registerEnumType(EUserRole, {
        name: 'UserRole',
        description: 'List of roles which could be assigned to user'
      });

      this.areEnumsRegistered = true;
    }
  }

  /**
   * Creates scoped server.
   * @param type
   * @private
   */
  static createScoped(
    type: 'public' | 'admin',
  ): ApolloServer {
    const {
      gqlPublicWSEndpoint,
      gqlAdminWSEndpoint,
    } = Container.get(ConfigToken);
    const getResolvers = type === 'public'
      ? getPublicResolvers : getAdminResolvers;
    const wsPath = type === 'public'
      ? gqlPublicWSEndpoint : gqlAdminWSEndpoint;

    return new ApolloServer({
      resolvers: [...getSharedResolvers(), ...getResolvers()],
      subscriptionsPath: wsPath || undefined,
      playground: true,
      // Allow introspection only for public resolvers.
      introspection: type === 'public',
    });
  }

  /**
   * Installs subscription handlers for apollo server in case subscriptions
   * path is specified. Does nothing in case, apollo server should not have
   * web socket connections.
   * @param httpServer
   */
  installSubscriptionHandlers(httpServer: HttpServer) {
    if (isString(this.server.subscriptionsPath)) {
      this.server.installSubscriptionHandlers(httpServer);
    }
  }

  /**
   * Returns correct Apollo's middleware.
   */
  getMiddleware(): Router {
    // We disable CORS due to is should be controlled from upper layers of
    // application. Path is set to "/" because it is controlled by upper layers
    // too.
    return this.server.getMiddleware({path: '/', cors: false});
  }
}