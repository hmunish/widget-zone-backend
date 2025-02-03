import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/shared/interfaces/user.interface';
import { UserRepository } from 'src/shared/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SigninService {
  constructor(private userRepository: UserRepository) {}

  public async init(userAuth: Partial<User>) {
    const user = await this.userRepository.find(userAuth);

    if (!user || !(await bcrypt.compare(userAuth.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      roles: user.roles,
    };
  }
}
