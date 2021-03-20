import {
  IJWTUnauthorizedContext, ISecurityAdapter,
  TJWTAnyContext, TJWTUser,
} from '~/shared/security-adapters';

/**
 * This file is used as global project configuration. Some of the application's
 * components (for example, UseContext decorator) use them to show you
 * correct types.
 */

/**
 * Map with settings for each provider.
 */
interface ISecurityAdapterSettings {
  jwt: {
    context: IJWTUnauthorizedContext;
    producedContext: TJWTAnyContext;
    user: TJWTUser;
  };
}

/**
 * Returns specified security adapter's setting.
 */
type TGetSecurityAdapterSetting<AdapterKey extends keyof ISecurityAdapterSettings,
  Setting extends keyof (ISecurityAdapterSettings[AdapterKey])> =
  ISecurityAdapterSettings[AdapterKey][Setting];

type TAppSecurityAdapterSetting<Setting extends keyof (ISecurityAdapterSettings[TAppSecurityAdapterType])>
  = TGetSecurityAdapterSetting<TAppSecurityAdapterType, Setting>;

/**
 * Current application security adapter. Change this value to some key of
 * ISecurityAdapterSettings to fastly change security adapter all over the
 * project.
 */
type TAppSecurityAdapterType = 'jwt';

export type TAppSecurityAdapterContext = TAppSecurityAdapterSetting<'context'>;
export type TAppSecurityAdapterProducedContext = TAppSecurityAdapterSetting<'producedContext'>;
export type TAppSecurityAdapterUser = TAppSecurityAdapterSetting<'user'>;
export type TAppSecurityAdapter = ISecurityAdapter<TAppSecurityAdapterContext,
  TAppSecurityAdapterProducedContext,
  TAppSecurityAdapterUser>;