import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigningUserDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { TToken } from '../common/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });

    if (!user || !this.hashService.compare(password, user.password)) {
      return null;
    }

    return user;
  }

  async signup(signingUserDto: SigningUserDto): Promise<User> {
    return await this.userService.createUser(signingUserDto);
  }

  async signin(user: User): Promise<TToken> {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return { access_token: token };
  }
}
