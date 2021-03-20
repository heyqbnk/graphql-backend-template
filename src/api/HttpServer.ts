import {createServer, Server} from 'http';
import express, {ErrorRequestHandler, Router} from 'express';
import cors from 'cors';
import {Inject, Service} from 'typedi';
import {ConfigToken} from '~/shared/di';
import {createApolloServer} from '~/api/gql';
import {registerEnums} from '~/api/gql/utils';
import {ApolloServer} from 'apollo-server-express';
import {Logger} from '~/shared/services';
import {isString} from '~/shared/utils';
import {IConfig} from '~/shared/config';

@Service()
export class HttpServer {
  @Inject(ConfigToken)
  config: IConfig;

  @Inject(() => Logger)
  logger: Logger;

  /**
   * Created http server instance. It is not recommended to use this field
   * directly, but who cares?
   * Becomes available only after calling "start" method.
   */
  httpServer: Server | undefined;

  /**
   * Returns correct Apollo's middleware.
   * @param server
   */
  static getMiddleware(server: ApolloServer): Router {
    // We disable CORS due to is should be controlled from upper layers of
    // application. Path is set to "/" because it is controlled by upper layers
    // too.
    return server.getMiddleware({path: '/', cors: false});
  }

  /**
   * Installs subscription handlers for apollo server in case subscriptions
   * path is specified. Does nothing in case, apollo server should not have
   * web socket connections.
   * @param apolloServer
   * @param httpServer
   */
  static installSubscriptionHandlers(
    apolloServer: ApolloServer,
    httpServer: Server,
  ): void {
    if (isString(apolloServer.subscriptionsPath)) {
      apolloServer.installSubscriptionHandlers(httpServer);
    }
  }

  /**
   * Starts http server.
   */
  start(): this {
    const {
      port, gqlAdminHttpEndpoint, gqlPublicHttpEndpoint, enableCors,
    } = this.config;
    const app = express();
    const httpServer = createServer(app);

    // Before creating Apollo servers, register all GraphQL enums.
    registerEnums();

    // Then, create servers for public and admin routes.
    const admServer = createApolloServer('admin');
    const publicServer = createApolloServer('public');

    // Install subscription handlers.
    HttpServer.installSubscriptionHandlers(publicServer, httpServer);
    HttpServer.installSubscriptionHandlers(admServer, httpServer);

    // Define fatal error catcher. It will catch errors occurring when client
    // sends incorrect body or something like that. For example, client could
    // send us header which states, its body is JSON, but it can be corrupted
    // and Express will throw error, which will not be handled correctly.
    const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }
      res.status(500).json({message: 'Something went wrong'});
    };
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(errorHandler);
    app.use(gqlAdminHttpEndpoint, HttpServer.getMiddleware(admServer));
    app.use(gqlPublicHttpEndpoint, HttpServer.getMiddleware(publicServer));

    // In case, CORS is required, apply them.
    if (enableCors) {
      app.use(cors());
    }

    // Open HTTP server port on specified port and log GraphQL servers endpoints.
    this.httpServer = httpServer.listen(port, () => {
      this.logger.log(`Public: http://localhost:${port}${gqlPublicHttpEndpoint}`);
      this.logger.log(`Admin: http://localhost:${port}${gqlAdminHttpEndpoint}`);
    });

    return this;
  }
}