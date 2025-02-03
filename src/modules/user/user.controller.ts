import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserWidgetDto } from './dto/create-user-widget.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt.strategy';
import { RolesGuard } from 'src/shared/guards/jwt-auth/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'src/shared/enums/common.interface';
import { ObjectId } from 'mongodb';
import { EditUserWidgetDto } from './dto/edit-user-widget.dto';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('verify/:verificationId')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async verifyUser(@Param('verificationId') verificationId: string) {
    try {
      await this.service.verifyUser(verificationId);
      return {
        message: 'User account has been successfully verified.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to verify user account. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Post('widgets')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async createWidget(@Req() req, @Body() body: CreateUserWidgetDto) {
    try {
      await this.service.createWidget({
        user: { id: req.user.id },
        widget: body,
      });
      return {
        message: 'Widget have successfully created.',
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Get('widgets')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async listWidget(@Req() req) {
    try {
      const data = await this.service.listWidget(req.user.id);
      return {
        message: 'Widget list have successfully been fetched.',
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Put('widgets/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async editWidget(
    @Req() req,
    @Param('id') id: ObjectId,
    @Body() body: EditUserWidgetDto,
  ) {
    try {
      await this.service.editWidget(id, {
        user: { id: req.user.id },
        widget: body,
      });
      return {
        message: 'Widget have successfully been edited.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to edit widget. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Delete('widgets/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async deleteWidget(@Req() req, @Param('id') id: ObjectId) {
    try {
      await this.service.deleteWidget(req.user.id, id);
      return {
        message: 'Widget have successfully been deleted.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to delete widget. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
