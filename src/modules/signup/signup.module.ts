import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SignupService } from './signup.service';
import { EmailService } from 'src/shared/services/email/email.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [SignupController],
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
  providers: [SignupService, UserRepository, EmailService],
})
export class SignupModule {}
