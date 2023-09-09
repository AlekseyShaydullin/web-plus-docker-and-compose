import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;
    const isExist = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (isExist) throw new UnauthorizedException(`Пользователь уже существует`);

    const newUser = this.userRepository.create({
      username: createUserDto.username,
      about: createUserDto.about,
      avatar: createUserDto.avatar,
      email: createUserDto.email,
      password: this.hashService.getHash(createUserDto.password),
    });

    return await this.userRepository.save(newUser);
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(query);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmailOrUserName(query: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const user = await this.findOne({ where: { username } });
    if (!user) throw new BadRequestException('Пользователь не найден');
    const wishes = await this.userRepository.find({
      select: ['wishes'],
      relations: {
        wishes: {
          owner: true,
          offers: {
            owner: {
              wishes: true,
              offers: true,
              wishlists: {
                owner: true,
                items: true,
              },
            },
          },
        },
      },
      where: {
        id: user.id,
      },
    });

    const wishesArr = wishes.map((item) => item.wishes);
    return wishesArr[0];
  }

  async updateById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, username, password } = updateUserDto;
    const user = await this.findOne({ where: { id } });

    if (email) {
      const emailOwner = await this.findOne({ where: { email } });
      if (emailOwner && emailOwner.id != id) {
        throw new ConflictException(`Эта почта уже используется`);
      }
    }

    if (username) {
      const usernameOwner = await this.findOne({ where: { username } });
      if (usernameOwner && usernameOwner.id != id) {
        throw new ConflictException(`Это имя уже используется`);
      }
    }

    if (password) {
      const passHash = this.hashService.getHash(updateUserDto.password);
      updateUserDto.password = passHash;
    }

    const updateUser = { ...user, ...updateUserDto };

    await this.userRepository.update({ id }, updateUser);
    return this.findOne({ where: { id } });
  }
}
