import {MiddlewareFn} from 'type-graphql';
import * as Sentry from '@sentry/node';
import {TAppSecurityAdapterProducedContext} from '~/shared/types';

/**
 * Middleware that catches error and sends it to Sentry.
 * @returns {MiddlewareFn<TAppSecurityAdapterProducedContext>}
 */
export const SentryMiddleware: MiddlewareFn<TAppSecurityAdapterProducedContext> =
  async (_, next) => {
    try {
      return await next();
    } catch (e) {
      Sentry.captureException(e);
      // Rethrow an error, so Apollo HttpServer could catch it and return
      // appropriately.
      throw e;
    }
  };