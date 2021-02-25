"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectDependencies = void 0;
const typedi_1 = require("typedi");
const config_1 = require("~/shared/config");
const tokens_1 = require("./tokens");
/**
 * Injects dependencies. It is important to launch project with this function
 * due to there can be dependencies which are injected asynchronously.
 * @returns {Promise<void>}
 */
async function injectDependencies() {
    typedi_1.Container.set(tokens_1.ConfigToken, config_1.config);
}
exports.injectDependencies = injectDependencies;

//# sourceMappingURL=utils.js.map
