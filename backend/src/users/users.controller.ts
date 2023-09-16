import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TUserRequest } from '../common/types';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET/users/me
  @Get('me')
  findMe(
    @Request()
    { user }: TUserRequest,
  ): Promise<User> {
    return this.usersService.findOneById(user.id);
  }

  // PATCH/users/me
  @Patch('me')
  update(
    @Request()
    { user }: TUserRequest,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateById(user.id, updateUserDto);
  }

  // GET/users/me/wishes
  @Get('me/wishes')
  async findMyWishes(
    @Request()
    { user }: TUserRequest,
  ): Promise<Wish[]> {
    const wishes = await this.usersService.findUserWishes(user.username);
    if (!wishes) throw new NotFoundException(`У пользователя нет пожеланий`);
    return wishes;
  }

  // GET/users/{username}
  @Get(':username')
  async getByUsername(
    @Param('username')
    username: string,
  ): Promise<User> {
    const user = await this.usersService.findOne({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return user;
  }

  // GET/users/{username}/wishes
  @Get(':username/wishes')
  async getWishesUser(
    @Param('username')
    username: string,
  ): Promise<Wish[]> {
    return this.usersService.findUserWishes(username);
  }

  // POST/users/find
  @Post('find')
  async findMany(
    @Body()
    findUserDto: FindUserDto,
  ): Promise<User[]> {
    return await this.usersService.findByEmailOrUserName(findUserDto.query);
  }
}
