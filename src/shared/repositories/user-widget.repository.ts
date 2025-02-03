import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter, ObjectId, UpdateFilter } from 'mongodb';
import { UserWidget } from '../interfaces/user-widget.interface';

@Injectable()
export class UserWidgetRepository {
  private collection = 'userWidgets';
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async list(userId: string) {
    const query: Filter<Document> = { 'user.id': userId };
    return await this.db.collection(this.collection).find(query).toArray();
  }

  async create(userWidget: UserWidget) {
    userWidget.widget.properties = [];
    return await this.db.collection(this.collection).insertOne(userWidget);
  }

  async find(userWidget: Partial<UserWidget>) {
    const query: Filter<Document> = { _id: new ObjectId(userWidget.id) };
    return await this.db.collection(this.collection).findOne(query);
  }

  async edit(id: ObjectId, userWidget: Partial<UserWidget>) {
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = { $set: userWidget };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }

  async delete(id: ObjectId) {
    const query: Filter<Document> = { _id: new ObjectId(id) };
    return await this.db.collection(this.collection).deleteOne(query);
  }

  async addProperty(id: ObjectId, property: string) {
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $addToSet: { 'widget.properties': property },
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }

  async deleteProperty(id: ObjectId, property: string) {
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $pull: { 'widget.properties': property }, // Removes the property if it exists
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }
}
