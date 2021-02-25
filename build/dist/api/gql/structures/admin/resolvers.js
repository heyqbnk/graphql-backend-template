"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminResolvers = void 0;
const user_1 = require("./user");
/**
 * Возвращает список резолверов для админской ручки TypeGraphQL.
 */
function getAdminResolvers() {
    return [
        user_1.UserMutationsResolver,
        user_1.UserQueriesResolver,
    ];
}
exports.getAdminResolvers = getAdminResolvers;

//# sourceMappingURL=resolvers.js.map
