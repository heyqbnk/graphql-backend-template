"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const package_json_1 = __importDefault(require("../../../package.json"));
// Getting environment variables from file.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const appEnv = utils_1.getAppEnvironment('APP_ENV');
const enableCors = utils_1.getBoolean('ENABLE_CORS', { defaultValue: false });
const enableMultiThread = utils_1.getBoolean('ENABLE_MULTI_THREAD', { defaultValue: true });
const port = utils_1.getNumber('PORT');
const sentryDsn = utils_1.getString('SENTRY_DSN', {
    // In production and staging require sentry.
    defaultValue: appEnv === 'local' ? '' : undefined,
});
const gqlAdminHttpEndpoint = utils_1.getString('GQL_ADMIN_HTTP_ENDPOINT', { defaultValue: '/gql-adm' });
const gqlAdminWSEndpoint = utils_1.getString('GQL_ADMIN_WS_ENDPOINT', { defaultValue: '' });
const gqlPublicHttpEndpoint = utils_1.getString('GQL_PUBLIC_HTTP_ENDPOINT', { defaultValue: '/gql' });
const gqlPublicWSEndpoint = utils_1.getString('GQL_PUBLIC_WS_ENDPOINT', { defaultValue: '' });
const jwtSecretKey = utils_1.getString('JWT_SECRET_KEY');
exports.config = {
    appEnv,
    enableCors,
    enableMultiThread,
    gqlAdminHttpEndpoint,
    gqlAdminWSEndpoint: gqlAdminWSEndpoint || null,
    gqlPublicHttpEndpoint,
    gqlPublicWSEndpoint: gqlPublicWSEndpoint || null,
    jwtSecretKey,
    port,
    release: package_json_1.default.version + '-' + appEnv,
    sentryDsn: sentryDsn === '' ? null : sentryDsn,
};

//# sourceMappingURL=config.js.map
