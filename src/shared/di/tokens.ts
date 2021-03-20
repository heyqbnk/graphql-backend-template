import {Token} from 'typedi';
import {IConfig} from '~/shared/config';
import {MongoClient} from 'mongodb';
import {TAppSecurityAdapter} from '~/shared/types';

/**
 * Application config.
 */
export const ConfigToken = new Token<IConfig>();
export {IConfig as Config};

/**
 * Connected MongoDB client.
 */
export const MongoClientToken = new Token<MongoClient>();
export {MongoClient};

/**
 * Application security adapter.
 */
export const SecurityAdapterToken = new Token<TAppSecurityAdapter>();
export {TAppSecurityAdapter as SecurityAdapter};