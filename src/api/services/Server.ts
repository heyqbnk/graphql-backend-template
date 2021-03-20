import {createServer as createHttpServer} from 'http';
import express, {ErrorRequestHandler} from 'express';
import cors from 'cors';
import {Inject, Service} from 'typedi';
import {ConfigToken} from '~/shared/di';
import {Logger} from '~/shared/services';
import {IConfig} from '~/shared/config';
import {ApolloServer} from '~/api/services/ApolloServer';

@Service()
export class Server {
  @Inject(ConfigToken)
  config: IConfig;

  @Inject(() => Logger)
  logger: Logger;

  /**
   * Starts http server.
   */
  start(): this {
    const {
      port, gqlAdminHttpEndpoint, gqlPublicHttpEndpoint, enableCors,
    } = this.config;
    const app = express();
    const httpServer = createHttpServer(app);

    // Then, create servers for public and admin routes.
    const admServer = ApolloServer.createScoped('admin');
    const publicServer = ApolloServer.createScoped('public');

    // Install subscription handlers.
    admServer.installSubscriptionHandlers(httpServer);
    publicServer.installSubscriptionHandlers(httpServer);

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
    app.use(gqlAdminHttpEndpoint, admServer.getMiddleware());
    app.use(gqlPublicHttpEndpoint, publicServer.getMiddleware());

    // In case, CORS is required, apply them.
    if (enableCors) {
      app.use(cors());
    }

    // Open HTTP server port on specified port and log GraphQL servers endpoints.
    httpServer.listen(port, () => {
      this.logger.log(`Public: http://localhost:${port}${gqlPublicHttpEndpoint}`);
      this.logger.log(`Admin: http://localhost:${port}${gqlAdminHttpEndpoint}`);
    });

    return this;
  }
}