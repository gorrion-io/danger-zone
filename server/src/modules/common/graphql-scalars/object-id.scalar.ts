import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ObjectId } from 'bson';
import { Kind, ValueNode } from 'graphql';

@Scalar('ObjectId')
export class ObjectIdScalar implements CustomScalar<string, ObjectId> {
  description = 'Mongo object id scalar type';

  parseValue(value: string): ObjectId {
    return new ObjectId(value);
  }

  serialize(value: ObjectId): string {
    return value.toHexString();
  }

  parseLiteral(ast: ValueNode): ObjectId {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  }
}
