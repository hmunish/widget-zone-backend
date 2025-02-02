import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth/jwt.strategy';
import { RolesGuard } from './shared/guards/jwt-auth/role.guard';
import { Roles } from './shared/decorators/role.decorator';
import { UserRole } from './shared/enums/common.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(UserRole.Admin)
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
