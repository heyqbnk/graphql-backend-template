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
   * Logs message into console.
   * @param args
   */
  log(...args: any[]) {
    if (this.config.appEnv === 'local') {
      console.log(
        bgGreenBright(black(bold('[Logger]'))),
        yellow(bold('[' + dayjs().format('hh:mm:ss')) + ']'),
        ...args,
      );
    }
  }
}
