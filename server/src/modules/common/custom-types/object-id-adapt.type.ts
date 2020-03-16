import { ObjectIdScalar } from '../graphql-scalars/object-id.scalar';
import { ObjectId } from 'bson';

export type ObjectIdAdapt = ObjectIdScalar | ObjectId;
