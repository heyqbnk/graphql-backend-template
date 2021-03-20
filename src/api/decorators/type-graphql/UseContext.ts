import {createParamDecorator} from 'type-graphql';
import {TAppSecurityAdapterProducedContext} from '~/shared/types';

/**
 * Returns current context.
 * @returns {ParameterDecorator}
 * @constructor
 */
export function UseContext() {
  return createParamDecorator<TAppSecurityAdapterProducedContext>(({context}) => context);
}

export {TAppSecurityAdapterProducedContext as Context};