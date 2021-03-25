import {ExpressContext} from 'apollo-server-express';
import {GraphQLError, GraphQLFormattedError} from 'graphql';
import {ExecutionParams} from 'subscriptions-transport-ws';
import {TValueOrPromise} from '~/shared/types';
import {AuthChecker} from 'type-graphql';

/**
 * Rewired express context with redefined connection.
 */
type TRewiredExpressContext<C> = Omit<ExpressContext, 'connection'> & {
  connection?: ExecutionParams<C>;
}

/**
 * Rewired more comfortable for usage function which creates context.
 */
export type TCreateContext<Context, ProducedContext> = (expressContext: TRewiredExpressContext<Context>) => TValueOrPromise<ProducedContext>;

/**
 * Function which returns user depending on context.
 */
export type TGetUser<Context, User> = (context: Context) => TValueOrPromise<User | null>;

/**
 * Describes security adapter which is used by apollo server in resolvers and
 * while processing client first request.
 */
export interface ISecurityAdapter<SocketContext, ProducedContext, User> {
  /**
   * Function which is called when when type-graphql's decorator
   * "Authorized" is called. It checks whether client has access to call
   * resolver.
   */
  authChecker?: AuthChecker<ProducedContext>;
  /**
   * Creates context which is used in resolvers. It is important, that context
   * creator should not forget options context. It means, there are 2 important
   * fields to process - "req" and "connection".
   * "req" is passed when request is being processed in usual http context,
   * and "connection" is passed when request was previously processed by
   * "onConnect" (the value you see there is object with "context" field which
   * equals value returned from this method).
   */
  createContext: TCreateContext<SocketContext, ProducedContext>;
  /**
   * Function which is called when client is trying to establish websocket
   * connection with current server. The result returned from this function
   * is passed to createContext's first argument (connection.context).
   * @param connectionParams
   */
  onConnect?(connectionParams: Record<any, any>): SocketContext;
  /**
   * Formats error occurred in resolver before sending it to client. Dont
   * forget that GraphQLFormattedError is just a minimal set of fields, it is
   * allowed to add any fields.
   */
  formatError(error: GraphQLError): GraphQLFormattedError;
  /**
   * Should return user from produced context.
   */
  getUser: TGetUser<ProducedContext, User>;
}