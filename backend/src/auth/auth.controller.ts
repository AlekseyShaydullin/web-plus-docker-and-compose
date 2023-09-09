import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigningUserDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { TToken } from '../common/types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: SigningUserDto): Promise<User> {
    return this.authService.signup(createAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req: { user: User }): Promise<TToken> {
    return this.authService.signin(req.user);
  }
}
