import {ParsedUrlQuery} from 'querystring';
import {IUser} from '~/shared/db';

/**
 * List of all known languages in VK.
 * @see vk_language in https://vk.com/dev/vk_apps_docs3?f=6.%2B%D0%9F%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B%2B%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D0%B0
 */
type TLang =
  | 'ru'
  | 'uk'
  | 'ua'
  | 'be'
  | 'en'
  | 'es'
  | 'fi'
  | 'de'
  | 'it'
  | 'kz'
  | 'pt'
  | string;

export interface ILaunchParams {
  /**
   * Application identifier.
   */
  appId: number;
  /**
   * User identifier.
   */
  userId: number;
  /**
   * Language.
   */
  lang: TLang;
}

export interface IVKMASocketContext {
  /**
   * Launch parameters sent from VK. Presented as parsed url query.
   * @see https://vk.com/dev/vk_apps_docs3?f=6.%2B%D0%9F%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B%2B%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D0%B0
   */
  launchParamsQuery: ParsedUrlQuery;
  /**
   * Parsed launch parameters.
   */
  launchParams: ILaunchParams;
}

export interface IVKMAHttpContext extends Pick<IVKMASocketContext, 'launchParamsQuery'> {
}

export type TVKMAProducedContext = IVKMASocketContext;

export type TVKMAUser = IUser;