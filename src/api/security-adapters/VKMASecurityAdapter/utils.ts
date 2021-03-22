import {ParsedUrlQuery} from 'querystring';
import crypto from 'crypto';
import {Container} from 'typedi';
import {ConfigToken} from '~/shared/di';
import {ILaunchParams} from '~/api/security-adapters';
import {isString} from '~/shared/utils';

interface IParseQueryResult {
  params: Record<string, string>;
  sign?: string;
}

/**
 * Accepts query as string or object and returns object with VK launch
 * parameters and they sign.
 * @param searchOrParsedUrlQuery
 */
function parseQuery(
  searchOrParsedUrlQuery: string | ParsedUrlQuery,
): IParseQueryResult {
  const result: IParseQueryResult = {params: {}};
  const processQueryParam = (key: string, value: any) => {
    if (typeof value === 'string') {
      if (key === 'sign') {
        result.sign = value;
      } else if (key.startsWith('vk_')) {
        result.params[key] = value;
      }
    }
  };

  if (typeof searchOrParsedUrlQuery === 'string') {
    const formattedSearch = searchOrParsedUrlQuery.startsWith('?')
      ? searchOrParsedUrlQuery.slice(1)
      : searchOrParsedUrlQuery;

    for (const param of formattedSearch.split('&')) {
      const [key, value] = param.split('=');
      processQueryParam(key, value);
    }
  } else {
    for (const key in searchOrParsedUrlQuery) {
      const value = searchOrParsedUrlQuery[key];
      processQueryParam(key, value);
    }
  }
  return result;
}

/**
 * Verifies launch parameters.
 * @param searchOrParsedUrlQuery
 */
export function verifyLaunchParams(
  searchOrParsedUrlQuery: string | ParsedUrlQuery,
): ILaunchParams | 'expired' | 'not-valid' {
  const {vkAppCredentials} = Container.get(ConfigToken);
  const {params, sign} = parseQuery(searchOrParsedUrlQuery);
  const keys = Object.keys(params);

  if (!isString(sign) || keys.length === 0) {
    return 'not-valid';
  }
  const timestamp = Number(params.vk_ts);

  if (Number.isNaN(timestamp)) {
    return 'not-valid';
  }

  // Maximum launch parameters duration is 1 day.
  if (Date.now() - timestamp * 1000 > 86400000) {
    return 'expired';
  }
  const appId = Number(params.vk_app_id);
  const userId = Number(params.vk_user_id);
  const lang = params.vk_language;

  if (Number.isNaN(appId) || Number.isNaN(userId)) {
    return 'not-valid';
  }
  // Recreate query as string with filtered set of parameters.
  const queryString = keys
    // Sort keys in ascending order.
    .sort((a, b) => a.localeCompare(b))
    // Recreate query as string.
    .reduce<string>((acc, key, idx) => {
      return acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(params[key])}`;
    }, '');

  // Check if created launch parameters were created by application credentials
  // specified in config.
  const isValid = vkAppCredentials.some(cred => {
    const {secretKey} = cred;

    if (appId !== cred.appId) {
      return false;
    }
    // Create hash with secret key.
    const paramsHash = crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest()
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    return paramsHash === sign;
  });

  return isValid ? {userId, lang, appId} : 'not-valid';
}