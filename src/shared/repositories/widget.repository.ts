import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter, ObjectId } from 'mongodb';
import { Widget } from '../interfaces/widget.interface';

@Injectable()
export class WidgetRepository {
  private collection = 'widgets';
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async list() {
    return await this.db
      .collection(this.collection)
      .find()
      .project({ _id: 0, id: '$_id', name: 1, description: 1 })
      .toArray();
  }

  async create(widget: Widget) {
    widget.name = widget.name.toLowerCase();
    return await this.db.collection(this.collection).insertOne(widget);
  }

  async find(widget: Partial<Widget>) {
    const query: Filter<Document> = {};

    if (widget.id) {
      query._id = new ObjectId(widget.id);
    } else {
      query.$or = [];
      if (widget.name) {
        query.$or.push({ name: widget.name });
      }
    }

    return await this.db.collection(this.collection).findOne(query);
  }
}
