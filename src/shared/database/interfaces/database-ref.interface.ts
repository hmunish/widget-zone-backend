import { MongoClient } from 'mongodb';

export interface DatabaseRef {
  client: MongoClient;
}
