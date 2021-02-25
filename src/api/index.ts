import '~/shared/globals';
import {ConfigToken, injectDependencies} from '~/shared/di';
import {Logger, PubSubProvider} from '~/shared/services';
import {fatalErrorCatcher} from '~/shared/utils';
import {Container} from 'typedi';
import {startHttpServer} from '~/api/http';
import {fork, isMaster} from 'cluster';
import os from 'os';
import * as Sentry from '@sentry/node';

/**
 * Initializes project in single thread mode.
 */
export function initSingleThread() {
  const logger = Container.get(Logger);
  logger.log('Config:', Container.get(ConfigToken));

  // Launch HTTP-server.
  startHttpServer();
}

/**
 * Initializes project in multi thread mode.
 */
export function initMultiThread() {
  if (isMaster) {
    const logger = Container.get(Logger);
    const config = Container.get(ConfigToken);
    logger.log('Config:', config);

    // Create maximum count of workers processor support.
    const cpuCount = os.cpus().length;

    for (let i = 0; i < cpuCount; i++) {
      fork();
    }

    // Dont forget to initialize PubSubProvider, so all the PubSub instances
    // in slave threads could use it.
    new PubSubProvider().init();
  } else {
    startHttpServer();
  }
}

/**
 * Launches project.
 * @returns {Server}
 */
export function init() {
  if (Container.get(ConfigToken).enableMultiThread) {
    return initMultiThread();
  }
  return initSingleThread();
}

// Inject async dependencies.
injectDependencies()
  // Initialize server
  .then(init)
  // In case, error occurs, catch it with sentry and exit from process.
  .catch(e => {
    fatalErrorCatcher(e);

    // Shutdown Sentry and lill process in 2 seconds.
    Sentry.close(2000).then(() => process.exit(1));
  });