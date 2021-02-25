import {Container} from 'typedi';
import {config} from '~/shared/config';
import {ConfigToken} from './tokens';

/**
 * Injects dependencies. It is important to launch project with this function
 * due to there can be dependencies which are injected asynchronously.
 * @returns {Promise<void>}
 */
export async function injectDependencies() {
  Container.set(ConfigToken, config);
}
