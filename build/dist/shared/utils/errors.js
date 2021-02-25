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
exports.warningsCatcher = exports.fatalErrorCatcher = exports.createCatcher = void 0;
const Sentry = __importStar(require("@sentry/node"));
const node_1 = require("@sentry/node");
/**
 * Creates function which cathes error with Sentry and logs it into console.
 * @param {Severity} severity
 * @returns {(e: Error) => void}
 */
function createCatcher(severity = node_1.Severity.Error) {
    return (e) => {
        console.error(e);
        Sentry.captureException(e, scope => scope.setLevel(severity));
    };
}
exports.createCatcher = createCatcher;
/**
 * Critical errors catcher.
 * @type {(e: Error) => void}
 */
exports.fatalErrorCatcher = createCatcher(node_1.Severity.Fatal);
/**
 * Warnings catcher.
 * @type {(e: Error) => void}
 */
exports.warningsCatcher = createCatcher(node_1.Severity.Warning);

//# sourceMappingURL=errors.js.map
