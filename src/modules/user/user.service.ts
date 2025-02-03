import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { console } from 'inspector';
import { ObjectId } from 'mongodb';
import { UserWidget } from 'src/shared/interfaces/user-widget.interface';
import { UserWidgetRepository } from 'src/shared/repositories/user-widget.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { WidgetRepository } from 'src/shared/repositories/widget.repository';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private widgetRepository: WidgetRepository,
    private userWidgetRepository: UserWidgetRepository,
  ) {}
  verifyJwToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret'),
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Invalid or expired token provided.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async verifyUser(verificationId: string) {
    const { userId } = this.verifyJwToken(verificationId);

    return await this.userRepository.verifyUser(userId);
  }

  async listWidget(userId: string) {
    return await this.userWidgetRepository.list(userId);
  }

  async createWidget(userWidget: UserWidget) {
    if (
      !(await this.widgetRepository.find({ id: userWidget.widget.type.id }))
    ) {
      throw new HttpException(
        {
          message: 'Invalid widget type id.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.userWidgetRepository.create(userWidget);
  }

  async editWidget(id: ObjectId, userWidget: UserWidget) {
    const widget = await this.userWidgetRepository.find({ id });

    if (widget?.user.id !== userWidget.user.id) {
      throw new HttpException(
        {
          message: 'You do not have permission to edit this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.edit(id, userWidget);
  }

  async deleteWidget(userId: ObjectId, widgetId: ObjectId) {
    const widget = await this.userWidgetRepository.find({ id: widgetId });

    if (widget?.user.id !== userId) {
      throw new HttpException(
        {
          message: 'You do not have permission to delete this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.delete(widgetId);
  }

  async addWidgetProperty(id: ObjectId, userId: ObjectId, property: string) {
    const widget = await this.userWidgetRepository.find({ id });

    if (widget?.user.id !== userId) {
      throw new HttpException(
        {
          message: 'You do not have permission to add this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.addProperty(id, property);
  }

  async deleteWidgetProperty(id: ObjectId, userId: ObjectId, property: string) {
    const widget = await this.userWidgetRepository.find({ id });

    if (widget?.user.id !== userId) {
      throw new HttpException(
        {
          message: 'You do not have permission to delete this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.deleteProperty(id, property);
  }
}
