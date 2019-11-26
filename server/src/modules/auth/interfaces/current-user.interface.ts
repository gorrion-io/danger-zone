import { ObjectId } from 'bson';

export interface ICurrentUser {
  _id: ObjectId;
  userName: string;
}
