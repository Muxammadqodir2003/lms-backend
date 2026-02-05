import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @Post('approve-instructor/:id')
  @Auth('ADMIN')
  async approveInstructor(
    @Param('id') id: string,
    @User('email') email: string,
  ) {
    return this.adminService.approveInstructor(id, email);
  }

  @HttpCode(200)
  @Post('deactivate-instructor/:id')
  @Auth('ADMIN')
  async deactivate(@Param('id') id: string) {
    return this.adminService.deactivateInstructor(id);
  }

  @HttpCode(200)
  @Get('logs')
  @Auth('ADMIN')
  async getLogs(@Query('page') page: string) {
    return await this.adminService.getLogs(+page);
  }
}
