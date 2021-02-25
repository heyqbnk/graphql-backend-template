import {TAppEnvironment} from '~/shared/types';

/**
 * Project configuration.
 */
export interface IConfig {
  appEnv: TAppEnvironment;
  enableCors: boolean,
  enableMultiThread: boolean;
  gqlAdminHttpEndpoint: string;
  gqlAdminWSEndpoint: string | null;
  gqlPublicHttpEndpoint: string;
  gqlPublicWSEndpoint: string | null;
  jwtSecretKey: string;
  port: number;
  release: string;
  sentryDsn: string | null;
}