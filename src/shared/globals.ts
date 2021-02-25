import 'reflect-metadata';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import {useContainer} from 'class-validator';
import {Container} from 'typedi';
import * as Sentry from '@sentry/node';
import {RewriteFrames} from '@sentry/integrations';
import {config} from '~/shared/config';
import path from 'path';

/**
 * This files is required part of application. It applies difference project
 * life required things such as initializing Sentry, configuring
 * class-validator and dayjs module.
 */

// Initialize sentry.
if (config.sentryDsn !== null) {
  const {sentryDsn, appEnv, release} = config;

  Sentry.init({
    attachStacktrace: true,
    dsn: sentryDsn,
    maxBreadcrumbs: 30,
    environment: appEnv,
    release,
    tracesSampleRate: 1,
    shutdownTimeout: 1000,
    integrations: [new RewriteFrames({
      // In production, to make source maps work, it is required to set root
      // referencing to dist folder.
      root: path.resolve(__dirname, '../..')
    })],
  });
  Sentry.setTag('Node Version', process.version);
}

// Replace container in class-validator.
useContainer(Container);

// Extend dayjs with useful plugins which can be handy not to make it in
// each file where plugins are used.
dayjs.extend(utc);
dayjs.extend(customParseFormat);
