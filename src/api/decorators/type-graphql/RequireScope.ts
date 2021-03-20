// import {createMethodDecorator} from 'type-graphql';
// import {EAccessScope} from '~/shared/types';
// import {TAnyContext} from '~/api/types';
// import {MissingScopeError, AuthorizationError} from '~/api/errors';
// import {isArray} from '~/shared/utils';
//
// /**
//  * Checks if current client has all required scopes.
//  * @param scopes
//  * @constructor
//  */
// export function RequireScope(scopes: EAccessScope | EAccessScope[]) {
//   const formattedScopes = isArray(scopes) ? scopes : [scopes];
//
//   return createMethodDecorator<TAnyContext>(async ({context}, next) => {
//     if (!('user' in context)) {
//       throw new AuthorizationError();
//     }
//     const isEachScopeFound = formattedScopes.every(s => {
//       return context.user.scopes.includes(s);
//     });
//
//     if (!isEachScopeFound) {
//       throw new MissingScopeError();
//     }
//     await next();
//   });
// }
export default {};