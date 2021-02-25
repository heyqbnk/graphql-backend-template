"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloServer = void 0;
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const middlewares_1 = require("~/api/gql/middlewares");
const typedi_1 = require("typedi");
const utils_1 = require("~/shared/utils");
const services_1 = require("~/shared/services");
const di_1 = require("~/shared/di");
const structures_1 = require("~/api/gql/structures");
const types_1 = require("~/api/gql/types");
/**
 * Formats error occurred in resolver before sending it to client. Removes
 * some private fields.
 * @param error
 */
function formatError(error) {
    var _a;
    const { name, extensions, path, message } = error;
    // Error thrown by Type GraphQL in Authorized decorator.
    if (message.startsWith('Access denied!')) {
        return {
            name: types_1.EApolloErrors.Forbidden,
            message,
            path,
        };
    }
    // Validation error thrown by class-validator.
    else if ((extensions === null || extensions === void 0 ? void 0 : extensions.exception) && 'validationErrors' in extensions.exception) {
        return {
            name: types_1.EApolloErrors.Validation,
            message,
            path,
            extensions: {
                exception: extensions === null || extensions === void 0 ? void 0 : extensions.exception.validationErrors,
            },
        };
    }
    // Error thrown by Apollo GraphQL Server occurring when query sent by
    // client is incorrect.
    else if (name === 'ValidationError') {
        return {
            name: types_1.EApolloErrors.Schema,
            message,
            path,
        };
    }
    // Error thrown in our code in some resolver. In case, error name is unknown,
    // use "UnknownError".
    else if (name === 'GraphQLError') {
        return {
            name: ((_a = extensions === null || extensions === void 0 ? void 0 : extensions.exception) === null || _a === void 0 ? void 0 : _a.name) || types_1.EApolloErrors.Unknown,
            message,
            path,
        };
    }
    // Unknown error.
    return { name, path, message };
}
/**
 * Creates context in Apollo Server.
 * @param {ExpressContext} options
 * @returns {any}
 */
const context = options => {
    const { req, connection } = options;
    let context;
    // In case, connection is undefined, it means, context is being created in
    // usual HTTP resolver.
    if (utils_1.isUndefined(connection)) {
        context = {
            token: (req.header('authorization') || '').split(' ')[1] || null,
        };
    }
    else {
        // Otherwise, we are in websocket context. Context was created previously in
        // "onConnect" method.
        context = connection.context;
    }
    const { token } = context;
    if (token !== null) {
        const payload = utils_1.decodeUserJWT(token);
        if (payload !== null) {
            return { ...context, user: payload };
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
function onConnect(connectionParams) {
    return {
        token: (connectionParams['authorization'] || '').split(' ')[1] || null
    };
}
/**
 * Creates apollo server with specified options.
 * @returns {ApolloServer}
 * @param schemaOptions
 */
function createServer(schemaOptions) {
    const { globalMiddlewares = [middlewares_1.SentryMiddleware], container = typedi_1.Container, subscriptionsPath, ...restSchemaOptions } = schemaOptions;
    const schema = type_graphql_1.buildSchemaSync({
        ...restSchemaOptions,
        globalMiddlewares,
        container,
        pubSub: subscriptionsPath ? typedi_1.Container.get(services_1.PubSub) : undefined,
    });
    const isNotLocal = typedi_1.Container.get(di_1.ConfigToken).appEnv !== 'local';
    return new apollo_server_express_1.ApolloServer({
        context,
        schema,
        subscriptions: utils_1.isString(subscriptionsPath) ? {
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
function createApolloServer(type) {
    const config = typedi_1.Container.get(di_1.ConfigToken);
    const getResolvers = type === 'public'
        ? structures_1.getPublicResolvers : structures_1.getAdminResolvers;
    const wsPath = type === 'public'
        ? config.gqlPublicWSEndpoint : config.gqlAdminWSEndpoint;
    return createServer({
        resolvers: [...structures_1.getSharedResolvers(), ...getResolvers()],
        subscriptionsPath: wsPath || undefined,
    });
}
exports.createApolloServer = createApolloServer;

//# sourceMappingURL=apollo.js.map
