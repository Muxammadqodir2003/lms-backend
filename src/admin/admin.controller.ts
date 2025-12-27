import { Controller, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('approve-instructor/:id')
  @Auth('ADMIN')
  async approveInstructor(@Param() id: string, @User('email') email: string) {
    return this.adminService.approveInstructor(id, email);
  }

  @Post('deactivate-instructor/:id')
  @Auth('ADMIN')
  async deactivate(@Param('id') id: string) {
    return this.adminService.deactivateInstructor(id);
  }
}
