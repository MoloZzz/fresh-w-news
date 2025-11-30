import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtAuthGuard } from './guard/optional-jwt.guard';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return req.user || { username: 'Guest' };
  }
}
