import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { console } from 'inspector';
import { ObjectId } from 'mongodb';
import {
  Advertisement,
  Newsletter,
  UserWidget,
} from 'src/shared/interfaces/user-widget.interface';
import { UserWidgetRepository } from 'src/shared/repositories/user-widget.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { WidgetRepository } from 'src/shared/repositories/widget.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  fillAdvertisementTemplate,
  fillNewsletterTemplate,
  fillTicketManagementTemplate,
} from './widget-template-helpers';
import { TicketStatus, Widget } from 'src/shared/enums/common.interface';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private widgetRepository: WidgetRepository,
    private userWidgetRepository: UserWidgetRepository,
    private cloudinaryService: CloudinaryService,
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

  async listWidget(userId: string, type: string) {
    return await this.userWidgetRepository.list(userId, type);
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

    if (widget.widget.data.image) {
      await this.cloudinaryService.deleteImage(
        widget.widget.data.image.publicId,
      );
    }

    return await this.userWidgetRepository.delete(widgetId);
  }

  async addWidgetImage(id: string, userId: string, file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file.buffer);

    const widget = await this.userWidgetRepository.find({
      id: new ObjectId(id),
    });

    if (widget?.user.id !== userId) {
      throw new HttpException(
        {
          message: 'You do not have permission to edit this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.userWidgetRepository.addImage(
      id,
      result.secure_url,
      result.public_id,
    );

    return result.secure_url;
  }

  async editWidgetImage(id: string, userId: string, file: Express.Multer.File) {
    const widget = await this.userWidgetRepository.find({
      id: new ObjectId(id),
    });

    if (widget?.user.id !== userId) {
      throw new HttpException(
        {
          message: 'You do not have permission to edit this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (widget.widget.data.image) {
      await this.cloudinaryService.deleteImage(
        widget.widget.data.image.publicId,
      );
    }

    await this.userWidgetRepository.deleteImage(id);

    return await this.addWidgetImage(id, userId, file);
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

  async addWidgetSubscriber(id: ObjectId, emailId: string, property: string) {
    const widget = await this.userWidgetRepository.find({ id });

    if (widget?.properties?.includes(property)) {
      throw new HttpException(
        {
          message: 'You do not have permission to access this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.addSubscriber(id, emailId, property);
  }

  async addWidgetTicket(
    id: ObjectId,
    ticket: { fullName: string; emailId: string; message: string },
    property: string,
  ) {
    const widget = await this.userWidgetRepository.find({ id });

    if (widget?.properties?.includes(property)) {
      throw new HttpException(
        {
          message: 'You do not have permission to access this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.addTicket(id, ticket, property);
  }

  async getWidgetTickets(userId: string, status?: TicketStatus) {
    return await this.userWidgetRepository.getTickets(userId, status);
  }

  async updateWidgetTicketStatus(
    userId: string,
    id: string,
    ticketId: string,
    status: TicketStatus,
  ) {
    const widget = await this.userWidgetRepository.find({
      id: new ObjectId(id),
    });

    if (widget?.user.id !== userId) {
      throw new HttpException(
        {
          message: 'You do not have permission to edit this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userWidgetRepository.updateTicketStatus(
      id,
      ticketId,
      status,
    );
  }

  async getWidgetSubscribers(userId: string, status?: TicketStatus) {
    return await this.userWidgetRepository.getSubscribers(userId);
  }

  async getWidgetScript(id: string, property) {
    const userWidget = await this.userWidgetRepository.find({
      id: new ObjectId(id),
    });

    if (!userWidget?.widget?.properties?.includes(property)) {
      throw new HttpException(
        {
          message: 'You do not have permission to access this data.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const widget = await this.widgetRepository.find({
      id: userWidget.widget.type.id,
    });

    let template = widget.script;

    switch (userWidget.widget.type.name) {
      case Widget.Newsletter:
        template = fillNewsletterTemplate(
          userWidget.widget.data,
          template,
          this.configService.get('app.url'),
        );
        break;
      case Widget.Advertisement:
        template = fillAdvertisementTemplate(userWidget.widget.data, template);
        break;
      case Widget.TicketManagement:
        template = fillTicketManagementTemplate(
          userWidget.widget.data,
          template,
          this.configService.get('app.url'),
        );
        break;
    }

    return template;
  }
}
