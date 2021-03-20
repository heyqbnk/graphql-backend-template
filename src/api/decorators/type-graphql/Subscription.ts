// import {
//   EPubSubEvent,
//   IAuthorizedContext,
//   TGetPubSubEventPayload,
// } from '~/api/types';
// import {ResolverFilterData} from 'type-graphql/dist/interfaces';
// import {
//   AdvancedOptions,
//   ReturnTypeFunc,
// } from 'type-graphql/dist/decorators/types';
// import {MergeExclusive} from 'type-graphql/dist/utils/types';
// import {ResolverFn} from 'graphql-subscriptions';
// import {Subscription as TGSubscription} from 'type-graphql';
//
// /**
//  * These types were taken from type-graphql.
//  */
// type TSubscriptionFilterFunc<E extends EPubSubEvent, Args = any> = (
//   resolverFilterData: ResolverFilterData<TGetPubSubEventPayload<E>, Args, IAuthorizedContext>,
// ) => boolean | Promise<boolean>;
//
// type TOptions<E extends EPubSubEvent, Args = any> =
//   AdvancedOptions
//   & MergeExclusive<{
//   topics: E | E[];
//   filter?: TSubscriptionFilterFunc<E, Args>;
// }, { subscribe: ResolverFn; }>;
//
// /**
//  * Typed decorator Subscription from type-graphql.
//  * @param {ReturnTypeFunc} returnTypeFunc
//  * @param {TOptions<E>} options
//  * @returns {MethodDecorator}
//  * @constructor
//  */
// export const Subscription = <E extends EPubSubEvent>(
//   returnTypeFunc: ReturnTypeFunc,
//   options: TOptions<E>,
// ): MethodDecorator => {
//   return TGSubscription(returnTypeFunc, options);
// };
export default {};