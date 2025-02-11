import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { UserStatus } from 'src/shared/enums/common.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt').secret,
    });
  }

  async validate(payload: { user: { id: string } }) {
    if (!payload.user?.id) {
      throw new UnauthorizedException();
    }

    const findUser = await this.userRepository.find({ id: payload.user.id });

    if (!findUser) {
      throw new UnauthorizedException();
    }

    // if (findUser.status === UserStatus.UnVerified) {
    //   throw new ForbiddenException();
    // }

    return { ...payload.user };
  }
}
