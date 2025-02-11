import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter, ObjectId } from 'mongodb';
import { User } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '../enums/common.interface';

@Injectable()
export class UserRepository {
  private collection = 'users';
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async find(user: Partial<User>) {
    const query: Filter<Document> = {};

    if (user.id) {
      query._id = new ObjectId(user.id);
    } else {
      query.$or = [];

      if (user.emailId) {
        query.$or.push({ emailId: user.emailId });
      }

      if (user.mobileNumber) {
        query.$or.push({ mobileNumber: user.mobileNumber });
      }
    }

    return await this.db.collection(this.collection).findOne(query);
  }

  async create(user: Partial<User>) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    user.status = UserStatus.UnVerified;
    user.roles = [UserRole.User];
    return await this.db.collection(this.collection).insertOne(user);
  }

  async verifyUser(userId: string) {
    return await this.db
      .collection(this.collection)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status: UserStatus.Verified } },
      );
  }
}
