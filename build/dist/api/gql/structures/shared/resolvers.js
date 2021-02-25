"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedResolvers = void 0;
const post_1 = require("./post");
const user_1 = require("./user");
/**
 * Return list of shared resolvers of GraphQL.
 * @returns {NonEmptyArray<any>}
 */
function getSharedResolvers() {
    return [
        post_1.PostFieldsResolver,
        user_1.UserFieldsResolver,
    ];
}
exports.getSharedResolvers = getSharedResolvers;

//# sourceMappingURL=resolvers.js.map
