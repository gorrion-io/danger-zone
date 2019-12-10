import { ObjectId } from 'bson';
import { ROLE } from '../../../constants/enums';

export interface ICurrentUser {
  _id: ObjectId;
  userName: string;
  role: ROLE;
}
