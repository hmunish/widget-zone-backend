import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Redirect,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { AddUserWidgetPropertyDto } from './dto/add-user-widget-property.dto';
import { DeleteUserWidgetPropertyDto } from './dto/delete-user-widget-property.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import * as multer from 'multer';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
@Controller('users')
export class UserController {
  constructor(
    private service: UserService,
    private configService: ConfigService,
  ) {}

  @Get('verify/:verificationId')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  @Redirect()
  async verifyUser(@Param('verificationId') verificationId: string) {
    try {
      await this.service.verifyUser(verificationId);
      return {
        url: `${this.configService.get('web.url')}/signin?message=User account has been successfully verified.`,
      };
    } catch (error) {
      const redirectUrl = `${this.configService.get('web.url')}/signin?message=${
        (error instanceof HttpException ? error.message : null) ||
        'Failed to verify user account. Please try again later.'
      }`;
      throw new HttpException(
        {
          url: redirectUrl,
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async getProfile(@Req() req) {
    try {
      const user = await this.service.getProfile(req.user.id);
      return { user, message: 'User profile have successfully been fetched.' };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to fetch user profile. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async updateProfile(@Req() req, @Body() body: UpdateUserProfileDto) {
    try {
      await this.service.updateProfile(req.user.id, body);
      return {
        message: 'User profile have successfully been updated.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to fetch user profile. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
