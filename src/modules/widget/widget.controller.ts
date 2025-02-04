import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WidgetService } from './widget.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt.strategy';
import { RolesGuard } from 'src/shared/guards/jwt-auth/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'src/shared/enums/common.interface';
import { CreateWidgetDto } from './dto/create-widget.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('widgets')
export class WidgetController {
  constructor(private service: WidgetService) {}

  @Get('')
  @Roles(UserRole.User)
  async get() {
    try {
      const data = await this.service.list();
      return {
        message: 'Widget list retrieved successfully.',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to fetch widget list. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':name')
  @Roles(UserRole.User)
  async details(@Param('name') name: string) {
    try {
      const data = await this.service.detail({ name });
      return {
        message: 'Widget detail retrieved successfully.',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to fetch widget detail. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('')
  // @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async create(@Body() body: CreateWidgetDto) {
    try {
      await this.service.create(body);
      return {
        message: 'Widget has been successfully created.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to create widget. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
