import {MiddlewareFn} from 'type-graphql';
import {TAnyContext} from '~/api/gql/types';
import * as Sentry from '@sentry/node';

/**
 * Middleware that catches error and sends it to Sentry.
 * @returns {MiddlewareFn<TAnyContext>}
 */
export const SentryMiddleware: MiddlewareFn<TAnyContext> =
  async ({context}, next) => {
    try {
      return await next();
    } catch (e) {
      Sentry.captureException(e, scope => {
        if ('user' in context) {
          // Set error user, so we could know which user had this problem.
          scope.setUser({id: context.user.id.toString()});
        }
        return scope;
      });
      // Rethrow an error, so Apollo Server could catch it and return
      // appropriately.
      throw e;
    }
  };