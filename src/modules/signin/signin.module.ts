import { Module } from '@nestjs/common';
import { SigninController } from './signin.controller';
import { SigninService } from './signin.service';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SigninController],
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt').secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SigninService, UserRepository],
})
export class SigninModule {}
