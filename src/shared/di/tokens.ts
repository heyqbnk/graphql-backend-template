import {Token} from 'typedi';
import {IConfig} from '~/shared/config';

/**
 * Application config.
 * @type {Token<IConfig>}
 */
export const ConfigToken = new Token<IConfig>();
