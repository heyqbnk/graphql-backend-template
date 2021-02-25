"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEnums = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("~/shared/types");
/**
 * Register all required GraphQL enums.
 */
function registerEnums() {
    type_graphql_1.registerEnumType(types_1.EAccessScope, {
        name: 'AccessScope',
        description: 'Access scopes which could be given to user'
    });
    type_graphql_1.registerEnumType(types_1.EUserRole, {
        name: 'UserRole',
        description: 'List of roles which could be assigned to user'
    });
}
exports.registerEnums = registerEnums;

//# sourceMappingURL=type-graphql.js.map
