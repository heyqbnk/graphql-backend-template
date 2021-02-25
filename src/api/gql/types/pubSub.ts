/**
 * List of available pub sub events.
 */
export enum EPubSubEvent {
  // FIXME
  EVENT = 'EVENT'
}

/**
 * Map, where key is a name of event and value is payload for this event.
 */
export interface IPubSubEventPayloadMap {
  // FIXME
  EVENT: {}
}

/**
 * Returns payload for specified pub sub event.
 */
export type TGetPubSubEventPayload<E extends keyof IPubSubEventPayloadMap> =
  IPubSubEventPayloadMap[E];