import {Token} from 'typedi';
import {IConfig} from '~/shared/config';
import {MongoClient} from 'mongodb';

/**
 * Application config.
 * @type {Token<IConfig>}
 */
export const ConfigToken = new Token<IConfig>();

/**
 * Connected MongoDB client.
 */
export const MongoClientToken = new Token<MongoClient>();