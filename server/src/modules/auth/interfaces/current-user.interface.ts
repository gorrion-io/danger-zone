import { ObjectId } from 'bson';
import { Role } from '../../users/models/user-role.enum';

export interface ICurrentUser {
  _id: ObjectId;
  userName: string;
  role: Role;
}
