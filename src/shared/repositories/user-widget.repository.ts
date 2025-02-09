import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter, ObjectId, UpdateFilter } from 'mongodb';
import { UserWidget } from '../interfaces/user-widget.interface';
import { TicketStatus, Widget } from '../enums/common.interface';

@Injectable()
export class UserWidgetRepository {
  private collection = 'userWidgets';
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async list(userId: string, type: string) {
    const query: Filter<Document> = {
      $and: [{ 'user.id': userId }, { 'widget.type.name': type }],
    };
    return await this.db.collection(this.collection).find(query).toArray();
  }

  async create(userWidget: UserWidget) {
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

  async addImage(id: string, image: string, publicId: string) {
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $set: { 'widget.data.image': { url: image, publicId } },
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }

  async deleteImage(id: string) {
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $unset: { 'widget.data.image': '' },
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
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

  async addSubscriber(id: ObjectId, emailId: string, property: string) {
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $addToSet: { 'widget.subscribers': { emailId, property } },
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }

  async addTicket(
    id: ObjectId,
    ticket: { fullName: string; emailId: string; message: string },
    property: string,
  ) {
    const newTicket = {
      _id: new ObjectId(),
      ...ticket,
      property,
      status: TicketStatus.Pending,
    };
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $addToSet: { 'widget.tickets': newTicket },
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }

  async getTickets(userId: string, status?: TicketStatus) {
    return await this.db
      .collection(this.collection)
      .aggregate([
        {
          $match: {
            'user.id': userId,
            'widget.type.name': Widget.TicketManagement,
          },
        },
        { $unwind: '$widget' },
        { $match: { 'widget.type.name': Widget.TicketManagement } },
        { $unwind: '$widget.tickets' },
        ...(status ? [{ $match: { 'widget.tickets.status': +status } }] : []),
        { $project: { _id: 0, ticket: '$widget.tickets' } },
      ])
      .toArray();
  }
}
