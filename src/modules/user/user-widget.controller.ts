import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
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
@Controller('users')
export class UserWidgetController {
  constructor(private service: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Post('widgets')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async createWidget(@Req() req, @Body() body: CreateUserWidgetDto) {
    try {
      const widget = await this.service.createWidget({
        user: { id: req.user.id },
        widget: body,
      });
      return {
        widget,
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
  @Post('widgets/:id/images')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype || !/^image\/(jpeg|jpg|png)$/.test(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPEG, JPG, and PNG are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadWidgetImage(
    @Req() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const url = await this.service.addWidgetImage(id, req.user.id, file);
      return { url };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to upload widget image. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Patch('widgets/:id/images')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype || !/^image\/(jpeg|jpg|png)$/.test(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPEG, JPG, and PNG are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async editWidgetImage(
    @Req() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const url = await this.service.editWidgetImage(id, req.user.id, file);
      return { url };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to edit widget image. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Get('widgets/:type')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async listWidget(@Req() req, @Param('type') type: string) {
    try {
      const data = await this.service.listWidget(req.user.id, type);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Post('widgets/:id/properties')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async addWidgetProperty(
    @Req() req,
    @Param('id') id: ObjectId,
    @Body() body: AddUserWidgetPropertyDto,
  ) {
    try {
      await this.service.addWidgetProperty(id, req.user.id, body.property);
      return {
        message: 'Property have successfully been added.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to add property. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @Delete('widgets/:id/properties')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async deleteWidgetProperty(
    @Req() req,
    @Param('id') id: ObjectId,
    @Body() body: DeleteUserWidgetPropertyDto,
  ) {
    try {
      await this.service.deleteWidgetProperty(id, req.user.id, body.property);
      return {
        message: 'Property have successfully been deleted.',
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to delete property. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('widgets/:id/script.js')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/javascript')
  @Header('Access-Control-Allow-Origin', '*')
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  async getWidgetScript(@Req() req, @Param('id') id: string) {
    try {
        return await this.service.getWidgetScript(id, req.hostname);
    } catch (error) {
      throw new HttpException(
        {
          message:
            (error instanceof HttpException ? error.message : null) ||
            'Failed to fetch script. Please try again later.',
        },
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
