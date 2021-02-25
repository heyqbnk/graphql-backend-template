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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const class_validator_1 = require("class-validator");
const typedi_1 = require("typedi");
const Sentry = __importStar(require("@sentry/node"));
const integrations_1 = require("@sentry/integrations");
const config_1 = require("~/shared/config");
const path_1 = __importDefault(require("path"));
/**
 * This files is required part of application. It applies difference project
 * life required things such as initializing Sentry, configuring
 * class-validator and dayjs module.
 */
// Initialize sentry.
if (config_1.config.sentryDsn !== null) {
    const { sentryDsn, appEnv, release } = config_1.config;
    Sentry.init({
        attachStacktrace: true,
        dsn: sentryDsn,
        maxBreadcrumbs: 30,
        environment: appEnv,
        release,
        tracesSampleRate: 1,
        shutdownTimeout: 1000,
        integrations: [new integrations_1.RewriteFrames({
                // In production, to make source maps work, it is required to set root
                // referencing to dist folder.
                root: path_1.default.resolve(__dirname, '../..')
            })],
    });
    Sentry.setTag('Node Version', process.version);
}
// Replace container in class-validator.
class_validator_1.useContainer(typedi_1.Container);
// Extend dayjs with useful plugins which can be handy not to make it in
// each file where plugins are used.
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(customParseFormat_1.default);

//# sourceMappingURL=globals.js.map
