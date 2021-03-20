import {PubSub as GqlPubSub, PubSubOptions} from 'graphql-subscriptions';
import {worker, isWorker, isMaster, workers, Worker} from 'cluster';
import {isObject, isString, isUndefined} from '~/shared/utils';
import {Service} from 'typedi';
import {EPubSubEvent, TGetPubSubEventPayload} from '~/api/types';

interface IPubSubMessage {
  type: 'PubSubMessage';
  triggerName: string;
  payload?: any;
}

function isPubSubMessage(value: any): value is IPubSubMessage {
  return isObject(value) &&
    value.type === 'PubSubMessage' &&
    isString(value.triggerName);
}

/**
 * Multi cluster provider for PubSub.
 */
export class PubSubProvider {
  init() {
    if (!isMaster) {
      throw new Error('Unable to create PubSubProvider not in main thread');
    }
    const workersArray = Object.values(workers).filter(w => !isUndefined(w)) as Worker[];

    workersArray.forEach(w => {
      if (!isUndefined(w)) {
        // Listen to each threads requests for events publication. In case,
        // request was received, it is required to notify all the threads about
        // they should do it.
        w.on('message', async message => {
          if (isPubSubMessage(message) && !isUndefined(process.send)) {
            workersArray.forEach(w => w.send(message));
          }
        });
      }
    });
  }
}

/**
 * Custom PubSub.
 */
@Service()
export class PubSub extends GqlPubSub {
  constructor(props?: PubSubOptions) {
    super(props);

    // Post event in case currently it is worker thread and event was received.
    if (isWorker) {
      worker.on('message', async message => {
        if (isPubSubMessage(message)) {
          await super.publish(message.triggerName, message.payload);
        }
      });
    }
  }

  async publish<E extends EPubSubEvent>(
    triggerName: E,
    payload: TGetPubSubEventPayload<E>,
  ): Promise<void> {
    // In case, we are in multi cluster mode, just notify all threads about it,
    // so they publish event.
    if (isWorker) {
      // При публикации события не забываем уведомить остальные потоки.
      const message: IPubSubMessage = {
        type: 'PubSubMessage',
        triggerName,
        payload,
      };
      worker.send(message);
      return;
    }
    // Otherwise, just publish event.
    return super.publish(triggerName, payload);
  }
}