"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRole = void 0;
const type_graphql_1 = require("type-graphql");
const errors_1 = require("~/api/gql/errors");
const utils_1 = require("~/shared/utils");
const typedi_1 = require("typedi");
const controllers_1 = require("~/shared/controllers");
/**
 * Checks if current client has all required roles.
 * @constructor
 * @param role
 */
function RequireRole(role) {
    return type_graphql_1.createMethodDecorator(async ({ context }, next) => {
        if (!('user' in context)) {
            throw new errors_1.AuthorizationError();
        }
        const usersController = typedi_1.Container.get(controllers_1.UsersController);
        const user = usersController.getById(context.user.id);
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        let hasRole = false;
        if (utils_1.isObject(role)) {
            for (const r of role.oneOf) {
                if (user.role === r) {
                    hasRole = true;
                    break;
                }
            }
        }
        else {
            hasRole = user.role === role;
        }
        if (!hasRole) {
            throw new errors_1.ForbiddenError();
        }
        await next();
    });
}
exports.RequireRole = RequireRole;

//# sourceMappingURL=RequireRole.js.map
