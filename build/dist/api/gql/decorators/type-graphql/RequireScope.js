"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireScope = void 0;
const type_graphql_1 = require("type-graphql");
const errors_1 = require("~/api/gql/errors");
const utils_1 = require("~/shared/utils");
/**
 * Checks if current client has all required scopes.
 * @param scopes
 * @constructor
 */
function RequireScope(scopes) {
    const formattedScopes = utils_1.isArray(scopes) ? scopes : [scopes];
    return type_graphql_1.createMethodDecorator(async ({ context }, next) => {
        if (!('user' in context)) {
            throw new errors_1.AuthorizationError();
        }
        const isEachScopeFound = formattedScopes.every(s => {
            return context.user.scopes.includes(s);
        });
        if (!isEachScopeFound) {
            throw new errors_1.MissingScopeError();
        }
        await next();
    });
}
exports.RequireScope = RequireScope;

//# sourceMappingURL=RequireScope.js.map
