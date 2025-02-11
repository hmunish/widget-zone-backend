import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import { DatabaseRef } from './interfaces/database-ref.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_REF',
      useFactory: (): DatabaseRef => ({ client: null }),
    },
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService, 'DATABASE_REF'],
      useFactory: async (
        config: ConfigService,
        dbRef: DatabaseRef,
      ): Promise<Db> => {
        try {
          const database = config.get('database');
          const client = await MongoClient.connect(database.url);
          dbRef.client = client;
          return client.db(database.name);
        } catch (error) {
          throw error;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
