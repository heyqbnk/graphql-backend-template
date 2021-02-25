"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsePubSub = void 0;
const PubSub_1 = require("type-graphql/dist/decorators/PubSub");
/**
 * Typed PubSub decorator.
 * @param triggerKey
 * @constructor
 */
exports.UsePubSub = (triggerKey) => {
    return PubSub_1.PubSub(triggerKey);
};

//# sourceMappingURL=UsePubSub.js.map
