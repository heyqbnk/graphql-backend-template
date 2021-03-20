import {injectDependencies} from '~/shared/di';
import {fatalErrorCatcher} from '~/shared/utils';
import * as Sentry from '@sentry/node';
import {App} from '~/api/App';
import {Container} from 'typedi';

// Inject async dependencies.
injectDependencies()
  // Initialize server
  .then(() => Container.get(App).start())
  // In case, error occurs, catch it with sentry and exit from process.
  .catch(e => {
    fatalErrorCatcher(e);

    // Shutdown Sentry and lill process in 2 seconds.
    Sentry.close(2000).then(() => process.exit(1));
  });