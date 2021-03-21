import {GraphQLScalarType, Kind} from 'graphql';
import {ObjectId} from 'bson';

/**
 * MongoDB ObjectID scalar type.
 * @type {GraphQLScalarType}
 */
export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'MongoDB ObjectID scalar type',
  parseValue(value: string) {
    return new ObjectId(value);
  },
  serialize(value: ObjectId) {
    return value.toHexString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  },
});
