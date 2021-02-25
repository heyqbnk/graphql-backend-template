import * as Sentry from '@sentry/node';
import {Severity} from '@sentry/node';

/**
 * Creates function which cathes error with Sentry and logs it into console.
 * @param {Severity} severity
 * @returns {(e: Error) => void}
 */
export function createCatcher(severity = Severity.Error) {
  return (e: Error) => {
    console.error(e);
    Sentry.captureException(e, scope => scope.setLevel(severity));
  };
}

/**
 * Critical errors catcher.
 * @type {(e: Error) => void}
 */
export const fatalErrorCatcher = createCatcher(Severity.Fatal);

/**
 * Warnings catcher.
 * @type {(e: Error) => void}
 */
export const warningsCatcher = createCatcher(Severity.Warning);