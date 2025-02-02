import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { JwtStrategy } from './shared/guards/jwt-auth/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { SignupModule } from './modules/signup/signup.module';
import { UserRepository } from './shared/repositories/user.repository';
import { DatabaseModule } from './shared/database/database.module';
import { SigninModule } from './modules/signin/signin.module';
import { WidgetModule } from './modules/widget/widget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
    SignupModule,
    SigninModule,
    UserModule,
    WidgetModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, UserRepository],
})
export class AppModule {}
