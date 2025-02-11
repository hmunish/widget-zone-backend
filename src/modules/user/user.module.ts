import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { WidgetRepository } from 'src/shared/repositories/widget.repository';
import { UserWidgetRepository } from 'src/shared/repositories/user-widget.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserWidgetController } from './user-widget.controller';

@Module({
  imports: [ConfigModule, DatabaseModule, JwtModule],
  controllers: [UserController, UserWidgetController],
  providers: [
    UserService,
    UserRepository,
    WidgetRepository,
    UserWidgetRepository,
    CloudinaryService,
  ],
})
export class UserModule {}
