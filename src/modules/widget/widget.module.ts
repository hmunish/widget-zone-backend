import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { WidgetController } from './widget.controller';
import { WidgetService } from './widget.service';
import { WidgetRepository } from 'src/shared/repositories/widget.repository';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [WidgetController],
  providers: [WidgetService, WidgetRepository]
})
export class WidgetModule {}
