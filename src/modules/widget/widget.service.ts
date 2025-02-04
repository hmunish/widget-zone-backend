import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WidgetRepository } from 'src/shared/repositories/widget.repository';
import { Widget } from 'src/shared/interfaces/widget.interface';

@Injectable()
export class WidgetService {
  constructor(private repository: WidgetRepository) {}

  async create(widget: Widget) {
    if (await this.repository.find(widget)) {
      throw new HttpException(
        {
          message: 'Widget name already exist',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.repository.create(widget);
  }

  async list() {
    return await this.repository.list();
  }

  async detail(widget: Partial<Widget>) {
    return await this.repository.find(widget);
  }
}
