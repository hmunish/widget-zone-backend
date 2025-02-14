import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/shared/interfaces/user.interface';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { EmailService } from 'src/shared/services/email/email.service';

@Injectable()
export class SignupService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  public async createUser(user: Partial<User>) {
    const findUser = await this.userRepository.find(user);

    if (findUser) {
      throw new HttpException(
        {
          message: 'Email or mobile number already exist',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const createdUser = await this.userRepository.create(user);

    const token = this.jwtService.sign(
      { userId: createdUser.insertedId },
      { expiresIn: this.configService.get('token.expiry.userVerification') },
    );

    this.emailService.sendUserVerificationLink(user.emailId, token);

    return true;
  }
}
