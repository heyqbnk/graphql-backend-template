import {EPubSubEvent, TGetPubSubEventPayload} from '~/api/types';
import {PubSub as TGPubSub} from 'type-graphql/dist/decorators/PubSub';
import {PubSub} from '~/shared/services';
import {Publisher} from 'type-graphql';

type TPubSub<E extends EPubSubEvent | null> = E extends EPubSubEvent
  ? Publisher<TGetPubSubEventPayload<E>>
  : PubSub;

/**
 * Typed PubSub decorator.
 * @param triggerKey
 * @constructor
 */
export const UsePubSub = <E extends EPubSubEvent>(
  triggerKey?: E,
): ParameterDecorator => {
  return TGPubSub(triggerKey);
};

export type {TPubSub as PubSub};