import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './utils/roles.decorator';
import { Role } from './modules/users/models/user-roles.enum';
import { RolesGuard } from './modules/auth/guards/user-roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Test method to try out the RolesGuard with Roles decorator
  @Get('test')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  testGet(): string {
    return 'test method';
  }
}
