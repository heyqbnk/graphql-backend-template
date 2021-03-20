import '~/shared/globals';
import {ConfigToken} from '~/shared/di';
import {Logger, PubSubProvider} from '~/shared/services';
import {Inject, Service} from 'typedi';
import {fork, isMaster} from 'cluster';
import os from 'os';
import {IConfig} from '~/shared/config';
import {Server} from '~/api/services/Server';

@Service()
export class App {
  @Inject(() => Logger)
  logger: Logger;

  @Inject(ConfigToken)
  config: IConfig;

  @Inject(() => Server)
  httpServer: Server;

  /**
   * Runs project in single thread mode.
   */
  private startSingleThread() {
    // Log config into console.
    this.logger.log('Config:', this.config);

    // Launch HTTP-server.
    this.httpServer.start();
  }

  /**
   * Runs project in multi thread mode.
   */
  private startMultiThread() {
    if (isMaster) {
      this.logger.log('Config:', this.config);

      // Create maximum count of workers processor support.
      const cpuCount = os.cpus().length;

      for (let i = 0; i < cpuCount; i++) {
        fork();
      }

      // Dont forget to initialize PubSubProvider, so all the PubSub instances
      // in slave threads could use it.
      new PubSubProvider().init();
    } else {
      this.httpServer.start();
    }
  }

  /**
   * Starts project.
   */
  start() {
    return this.config.enableMultiThread
      ? this.startMultiThread()
      : this.startSingleThread();
  }
}