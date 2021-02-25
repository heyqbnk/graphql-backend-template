"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseToken = void 0;
const type_graphql_1 = require("type-graphql");
const errors_1 = require("~/api/gql/errors");
/**
 * Returns JWT information.
 * @returns {ParameterDecorator}
 * @constructor
 */
function UseToken() {
    return type_graphql_1.createParamDecorator(({ context }) => {
        if (!('user' in context)) {
            throw new errors_1.UserNotFoundError();
        }
        const { id, scopes } = context.user;
        return {
            userId: id,
            scopes,
            token: context.token,
        };
    });
}
exports.UseToken = UseToken;

//# sourceMappingURL=UseToken.js.map
