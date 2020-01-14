import { ObjectId } from 'bson';
import { Role } from 'src/modules/users/models/user-roles.enum';

export interface ICurrentUser {
  _id: ObjectId;
  userName: string;
  roles?: Role[];
}
