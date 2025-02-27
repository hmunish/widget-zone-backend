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
      $addToSet: {
        'widget.subscribers': { emailId, property, subscribedAt: new Date() },
      },
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
      createdAt: new Date(),
    };
    const query: Filter<UserWidget> = { _id: new ObjectId(id) };
    const update: UpdateFilter<UserWidget> = {
      $addToSet: { 'widget.tickets': {...newTicket, _id: new ObjectId(newTicket._id)} },
    };

    return await this.db
      .collection<UserWidget>(this.collection)
      .updateOne(query, update);
  }

  async getTickets(
    userId: string,
    status?: TicketStatus,
    countByMonth?: boolean,
  ) {
    const matchStage: any = {
      'user.id': userId,
      'widget.type.name': Widget.TicketManagement,
    };

    const pipeline: any[] = [
      { $match: matchStage },
      { $unwind: '$widget.tickets' },
    ];

    if (status !== undefined) {
      pipeline.push({ $match: { 'widget.tickets.status': +status } });
    }

    if (countByMonth) {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

      pipeline.push(
        { $unwind: '$widget.tickets' },
        {
          $addFields: {
            'widget.tickets.createdAt': {
              $dateFromString: { dateString: '$widget.tickets.createdAt' }
            }
          }
        },
        {
          $match: {
            'widget.tickets.createdAt': {
              $gte: startOfYear,
              $lt: endOfYear,
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: '$widget.tickets.createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.month': 1 } },
      );

      const results = await this.db
        .collection(this.collection)
        .aggregate(pipeline)
        .toArray();

      const monthlyCounts: number[] = new Array(12).fill(0);

      results.forEach(({ _id, count }) => {
        monthlyCounts[_id.month - 1] = count;
      });

      return monthlyCounts;
    } else {
      pipeline.push({ $project: { _id: 1, ticket: '$widget.tickets' } });
      return await this.db
        .collection(this.collection)
        .aggregate(pipeline)
        .toArray();
    }
  }

  async getSubscribers(userId: string, countByMonth?: boolean) {
    const pipeline: any[] = [
      {
        $match: {
          'user.id': userId,
          'widget.type.name': 'newsletter',
        },
      },
      { $unwind: '$widget' },
      { $match: { 'widget.type.name': 'newsletter' } },
      { $unwind: '$widget.subscribers' },
    ];

    if (countByMonth) {
      pipeline.push(
        {
          $group: {
            _id: { $month: { $toDate: '$widget.subscribers.subscribedAt' } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: '$_id',
            count: 1,
          },
        },
        { $sort: { month: 1 } },
      );

      const result = await this.db
        .collection(this.collection)
        .aggregate(pipeline)
        .toArray();

      const countsArray = Array(12).fill(0);

      result.forEach(({ month, count }) => {
        countsArray[month - 1] = count;
      });

      return countsArray;
    } else {
      pipeline.push({
        $project: { _id: 1, subscriber: '$widget.subscribers' },
      });
    }

    return await this.db
      .collection(this.collection)
      .aggregate(pipeline)
      .toArray();
  }

  async updateTicketStatus(
    widgetId: string,
    ticketId: string,
    status: TicketStatus,
  ) {
    const query: Filter<Document> = {
      _id: new ObjectId(widgetId),
      'widget.tickets._id': new ObjectId(ticketId),
    };

    const update = {
      $set: { 'widget.tickets.$.status': status },
    };

    const result = await this.db
      .collection(this.collection)
      .updateOne(query, update);

    return result.modifiedCount > 0
      ? { message: 'Ticket status updated successfully' }
      : { message: 'Ticket not found or already updated' };
  }
}
