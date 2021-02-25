"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicResolvers = void 0;
const post_1 = require("./post");
const user_1 = require("./user");
/**
 * Return list of public resolvers of GraphQL.
 */
function getPublicResolvers() {
    return [
        post_1.PostMutationsResolver,
        post_1.PostQueriesResolver,
        user_1.UserMutationsResolver,
        user_1.UserQueriesResolver,
    ];
}
exports.getPublicResolvers = getPublicResolvers;

//# sourceMappingURL=resolvers.js.map
