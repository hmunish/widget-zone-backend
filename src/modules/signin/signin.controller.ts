import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SigninService } from './signin.service';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('signin')
export class SigninController {
  constructor(
    private service: SigninService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  public async init(@Body() body: SigninDto) {
    try {
      const user = await this.service.init(body);
      return {
        token: this.jwtService.sign(
          { user: user },
          {
            expiresIn: this.configService.get('token.expiry.signin'),
          },
        ),
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to authorize. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
