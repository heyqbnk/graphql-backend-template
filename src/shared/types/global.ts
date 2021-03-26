import {
  ISecurityAdapter,
  TJWTUser,
  IJWTSocketContext,
  TJWTProducedContext,
  IVKMASocketContext,
  TVKMAUser,
  IVKMAHttpContext,
  TVKMAProducedContext, TJWTHttpContext,
} from '~/api/security-adapters';

/**
 * This file is used as global project configuration. Some of the application's
 * components (for example, UseContext decorator) use them to show you
 * correct types.
 */

type TCreateAdapterSettings<SocketContext, HttpContext, ProducedContext, User> = {
  socketContext: SocketContext;
  httpContext: HttpContext;
  producedContext: ProducedContext;
  user: User;
}

/**
 * Map with settings for each provider.
 */
interface ISecurityAdapterSettings {
  jwt: TCreateAdapterSettings<IJWTSocketContext, TJWTHttpContext, TJWTProducedContext, TJWTUser>;
  vk: TCreateAdapterSettings<IVKMASocketContext, IVKMAHttpContext, TVKMAProducedContext, TVKMAUser>;
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
type TAppSecurityAdapterType = 'vk';

export type TAppSecurityAdapterSocketContext = TAppSecurityAdapterSetting<'socketContext'>;

export type TAppSecurityAdapterHttpContext = TAppSecurityAdapterSetting<'httpContext'>;

export type TAppSecurityAnyUnsafeContext =
  | TAppSecurityAdapterSocketContext
  | TAppSecurityAdapterHttpContext;

export type TAppSecurityAdapterProducedContext = TAppSecurityAdapterSetting<'producedContext'>;

export type TAppSecurityAdapterUser = TAppSecurityAdapterSetting<'user'>;

export type TAppSecurityAdapter = ISecurityAdapter<TAppSecurityAdapterSocketContext,
  TAppSecurityAdapterHttpContext,
  TAppSecurityAdapterProducedContext,
  TAppSecurityAdapterUser>;