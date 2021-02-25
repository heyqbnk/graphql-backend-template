"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHttpServer = void 0;
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typedi_1 = require("typedi");
const di_1 = require("~/shared/di");
const gql_1 = require("~/api/gql");
const utils_1 = require("~/api/gql/utils");
const services_1 = require("~/shared/services");
const utils_2 = require("~/shared/utils");
/**
 * Returns correct middleware for Apollo server.
 * @param {ApolloServer} server
 * @returns {express.Router}
 */
function getServerMiddleware(server) {
    // We disable CORS due to is should be controlled from upper layers of
    // application. Path is set to "/" because it is controlled by upper layers
    // too.
    return server.getMiddleware({ path: '/', cors: false });
}
/**
 * Installs subscription handlers for apollo server in case, it is required.
 * @param {ApolloServer} apolloServer
 * @param {Server} httpServer
 */
function installSubscriptionHandlers(apolloServer, httpServer) {
    if (utils_2.isString(apolloServer.subscriptionsPath)) {
        apolloServer.installSubscriptionHandlers(httpServer);
    }
}
/**
 * Starts HTTP-server.
 * @returns {void}
 */
function startHttpServer() {
    const { port, gqlAdminHttpEndpoint, gqlPublicHttpEndpoint, enableCors, } = typedi_1.Container.get(di_1.ConfigToken);
    const logger = typedi_1.Container.get(services_1.Logger);
    const app = express_1.default();
    const httpServer = http_1.createServer(app);
    // Before creating Apollo servers, register all GraphQL enums.
    utils_1.registerEnums();
    // Then, create servers for public and admin routes.
    const admServer = gql_1.createApolloServer('admin');
    const publicServer = gql_1.createApolloServer('public');
    // Install subscription handlers.
    installSubscriptionHandlers(publicServer, httpServer);
    installSubscriptionHandlers(admServer, httpServer);
    // Define fatal error catcher. It will catch errors occurring when client
    // sends incorrect body or something like that. For example, client could
    // send us header which states, his body is JSON, but it can be corrupted
    // and Express will throw error, which will not be handler correctly.
    const errorHandler = (err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({ message: 'Something went wrong' });
    };
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(errorHandler);
    app.use(gqlAdminHttpEndpoint, getServerMiddleware(admServer));
    app.use(gqlPublicHttpEndpoint, getServerMiddleware(publicServer));
    // In case, CORS is required, apply them.
    if (enableCors) {
        app.use(cors_1.default());
    }
    // Open HTTP server port on specified port and log GraphQL servers endpoints.
    return httpServer.listen(port, () => {
        logger.log(`Public: http://localhost:${port}${gqlPublicHttpEndpoint}`);
        logger.log(`Admin: http://localhost:${port}${gqlAdminHttpEndpoint}`);
    });
}
exports.startHttpServer = startHttpServer;

//# sourceMappingURL=http.js.map
