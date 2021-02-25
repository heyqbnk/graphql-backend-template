import {registerEnumType} from 'type-graphql';
import {EAccessScope, EUserRole} from '~/shared/types';

/**
 * Register all required GraphQL enums.
 */
export function registerEnums() {
  registerEnumType(EAccessScope, {
    name: 'AccessScope',
    description: 'Access scopes which could be given to user'
  });
  registerEnumType(EUserRole, {
    name: 'UserRole',
    description: 'List of roles which could be assigned to user'
  });
}
