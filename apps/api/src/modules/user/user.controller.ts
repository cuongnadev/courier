import {
  Controller,
  Delete,
  Get,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Version('1')
  @Delete('me')
  deleteMe(@Req() request: AuthenticatedRequest) {
    return this.userService.deleteMe(request.user.sub);
  }
}
