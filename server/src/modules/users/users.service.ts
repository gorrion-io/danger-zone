import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { AddUserInput } from './models/add-user.input';
import { EditUserInput } from './models/edit-user.input';
import { User } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
  ) { }

  async find(id: ObjectId): Promise<User> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async add(dto: AddUserInput): Promise<User> {
    const user = new this.userModel();

    Object.assign(user, dto);

    return user.save();
  }

  async edit(dto: EditUserInput): Promise<User> {
    const user = await this.userModel.findById(dto._id);
    if (!user) {
      throw new Error(`User with id: "${dto._id}" not found.`);
    }

    Object.assign(user, dto);

    return user.save();
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error(`User with id: "${id}" not found.`);
    }

    await user.remove();
    return id;
  }
}
