"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const type_graphql_1 = require("type-graphql");
/**
 * Typed decorator Subscription from type-graphql.
 * @param {ReturnTypeFunc} returnTypeFunc
 * @param {TOptions<E>} options
 * @returns {MethodDecorator}
 * @constructor
 */
exports.Subscription = (returnTypeFunc, options) => {
    return type_graphql_1.Subscription(returnTypeFunc, options);
};

//# sourceMappingURL=Subscription.js.map
