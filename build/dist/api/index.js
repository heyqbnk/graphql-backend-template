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
exports.init = exports.initMultiThread = exports.initSingleThread = void 0;
require("~/shared/globals");
const di_1 = require("~/shared/di");
const services_1 = require("~/shared/services");
const utils_1 = require("~/shared/utils");
const typedi_1 = require("typedi");
const http_1 = require("~/api/http");
const cluster_1 = require("cluster");
const os_1 = __importDefault(require("os"));
const Sentry = __importStar(require("@sentry/node"));
/**
 * Initializes project in single thread mode.
 */
function initSingleThread() {
    const logger = typedi_1.Container.get(services_1.Logger);
    logger.log('Config:', typedi_1.Container.get(di_1.ConfigToken));
    // Launch HTTP-server.
    http_1.startHttpServer();
}
exports.initSingleThread = initSingleThread;
/**
 * Initializes project in multi thread mode.
 */
function initMultiThread() {
    if (cluster_1.isMaster) {
        const logger = typedi_1.Container.get(services_1.Logger);
        const config = typedi_1.Container.get(di_1.ConfigToken);
        logger.log('Config:', config);
        // Create maximum count of workers processor support.
        const cpuCount = os_1.default.cpus().length;
        for (let i = 0; i < cpuCount; i++) {
            cluster_1.fork();
        }
        // Dont forget to initialize PubSubProvider, so all the PubSub instances
        // in slave threads could use it.
        new services_1.PubSubProvider().init();
    }
    else {
        http_1.startHttpServer();
    }
}
exports.initMultiThread = initMultiThread;
/**
 * Launches project.
 * @returns {Server}
 */
function init() {
    if (typedi_1.Container.get(di_1.ConfigToken).enableMultiThread) {
        return initMultiThread();
    }
    return initSingleThread();
}
exports.init = init;
// Inject async dependencies.
di_1.injectDependencies()
    // Initialize server
    .then(init)
    // In case, error occurs, catch it with sentry and exit from process.
    .catch(e => {
    utils_1.fatalErrorCatcher(e);
    // Shutdown Sentry and lill process in 2 seconds.
    Sentry.close(2000).then(() => process.exit(1));
});

//# sourceMappingURL=index.js.map
