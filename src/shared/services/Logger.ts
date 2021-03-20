import {Inject, Service} from 'typedi';
import {black, yellow, bgGreenBright, bold} from 'chalk';
import dayjs from 'dayjs';
import {ConfigToken} from '~/shared/di';
import {IConfig} from '~/shared/config';

/**
 * Responsible for messages logging.
 */
@Service()
export class Logger {
  @Inject(ConfigToken)
  config: IConfig;

  /**
   * Logs message into console only in case application environment allows it.
   * @param args
   */
  log(...args: any[]) {
    // Log message only in case application is run
    if (this.config.appEnv === 'local') {
      this.logForce(...args);
    }
  }

  /**
   * Logs message into console without checking current application
   * environment.
   * @param args
   */
  logForce(...args: any[]) {
    console.log(
      bgGreenBright(black(bold('[Logger]'))),
      yellow(bold('[' + dayjs().format('hh:mm:ss')) + ']'),
      ...args,
    );
  }
}
