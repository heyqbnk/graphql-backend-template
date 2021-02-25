"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryMiddleware = void 0;
const Sentry = __importStar(require("@sentry/node"));
/**
 * Middleware that catches error and sends it to Sentry.
 * @returns {MiddlewareFn<TAnyContext>}
 */
exports.SentryMiddleware = async ({ context }, next) => {
    try {
        return await next();
    }
    catch (e) {
        Sentry.captureException(e, scope => {
            if ('user' in context) {
                // Set error user, so we could know which user had this problem.
                scope.setUser({ id: context.user.id.toString() });
            }
            return scope;
        });
        // Rethrow an error, so Apollo Server could catch it and return
        // appropriately.
        throw e;
    }
};

//# sourceMappingURL=SentryMiddleware.js.map
