import {createServer, Server} from 'http';
import express, {ErrorRequestHandler} from 'express';
import cors from 'cors';
import {Container} from 'typedi';
import {ConfigToken} from '~/shared/di';
import {createApolloServer} from '~/api/gql';
import {registerEnums} from '~/api/gql/utils';
import {ApolloServer} from 'apollo-server-express';
import {Logger} from '~/shared/services';
import {isString} from '~/shared/utils';

/**
 * Returns correct middleware for Apollo server.
 * @param {ApolloServer} server
 * @returns {express.Router}
 */
function getServerMiddleware(server: ApolloServer) {
  // We disable CORS due to is should be controlled from upper layers of
  // application. Path is set to "/" because it is controlled by upper layers
  // too.
  return server.getMiddleware({path: '/', cors: false});
}

/**
 * Installs subscription handlers for apollo server in case, it is required.
 * @param {ApolloServer} apolloServer
 * @param {Server} httpServer
 */
function installSubscriptionHandlers(
  apolloServer: ApolloServer,
  httpServer: Server
) {
  if (isString(apolloServer.subscriptionsPath)) {
    apolloServer.installSubscriptionHandlers(httpServer);
  }
}

/**
 * Starts HTTP-server.
 * @returns {void}
 */
export function startHttpServer() {
  const {
    port, gqlAdminHttpEndpoint, gqlPublicHttpEndpoint, enableCors,
  } = Container.get(ConfigToken);
  const logger = Container.get(Logger);
  const app = express();
  const httpServer = createServer(app);

  // Before creating Apollo servers, register all GraphQL enums.
  registerEnums();

  // Then, create servers for public and admin routes.
  const admServer = createApolloServer('admin');
  const publicServer = createApolloServer('public');

  // Install subscription handlers.
  installSubscriptionHandlers(publicServer, httpServer);
  installSubscriptionHandlers(admServer, httpServer);

  // Define fatal error catcher. It will catch errors occurring when client
  // sends incorrect body or something like that. For example, client could
  // send us header which states, his body is JSON, but it can be corrupted
  // and Express will throw error, which will not be handler correctly.
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({message: 'Something went wrong'});
  };
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(errorHandler);
  app.use(gqlAdminHttpEndpoint, getServerMiddleware(admServer));
  app.use(gqlPublicHttpEndpoint, getServerMiddleware(publicServer));

  // In case, CORS is required, apply them.
  if (enableCors) {
    app.use(cors());
  }

  // Open HTTP server port on specified port and log GraphQL servers endpoints.
  return httpServer.listen(port, () => {
    logger.log(`Public: http://localhost:${port}${gqlPublicHttpEndpoint}`);
    logger.log(`Admin: http://localhost:${port}${gqlAdminHttpEndpoint}`);
  });
}
