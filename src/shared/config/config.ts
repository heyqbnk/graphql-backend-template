import {IConfig} from './types';
import {
  getAppEnvironment,
  getBoolean,
  getNumber,
  getString,
} from './utils';
import path from 'path';
import dotenv from 'dotenv';
import packageJson from '../../../package.json';

// Getting environment variables from file.
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const appEnv = getAppEnvironment('APP_ENV');
const enableCors = getBoolean('ENABLE_CORS', {defaultValue: false});
const enableMultiThread = getBoolean('ENABLE_MULTI_THREAD', {defaultValue: true});
const port = getNumber('PORT');
const sentryDsn = getString('SENTRY_DSN', {
  // In production and staging require sentry.
  defaultValue: appEnv === 'local' ? '' : undefined,
});
const gqlAdminHttpEndpoint = getString('GQL_ADMIN_HTTP_ENDPOINT', {defaultValue: '/gql-adm'});
const gqlAdminWSEndpoint = getString('GQL_ADMIN_WS_ENDPOINT', {defaultValue: ''});
const gqlPublicHttpEndpoint = getString('GQL_PUBLIC_HTTP_ENDPOINT', {defaultValue: '/gql'});
const gqlPublicWSEndpoint = getString('GQL_PUBLIC_WS_ENDPOINT', {defaultValue: ''});
const jwtSecretKey = getString('JWT_SECRET_KEY');

export const config: IConfig = {
  appEnv,
  enableCors,
  enableMultiThread,
  gqlAdminHttpEndpoint,
  gqlAdminWSEndpoint: gqlAdminWSEndpoint || null,
  gqlPublicHttpEndpoint,
  gqlPublicWSEndpoint: gqlPublicWSEndpoint || null,
  jwtSecretKey,
  port,
  release: packageJson.version + '-' + appEnv,
  sentryDsn: sentryDsn === '' ? null : sentryDsn,
};
