import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository, UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, id: number): Promise<Wish> {
    const owner = await this.userService.findOneById(id);
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return this.wishRepository.save(newWish);
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return await this.wishRepository.findOne(query);
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          owner: true,
          item: true,
        },
      },
    });

    if (!wish) throw new BadRequestException('Подарок не найден');

    return wish;
  }

  async findMany(giftsId: number[]): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { id: In(giftsId) },
    });
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 10,
      order: { copied: 'desc' },
      relations: ['owner', 'offers'],
    });
  }

  async updateWish(
    id: number,
    updateWishDto: UpdateWishDto,
    ownerId: number,
  ): Promise<Wish> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    if (wish.owner.id !== ownerId) {
      throw new NotAcceptableException(`Этот подарок другого пользователя`);
    }

    await this.wishRepository.save({ ...wish, ...updateWishDto });

    return await this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async updateRise(id: number, newRise: number): Promise<UpdateResult> {
    return await this.wishRepository.update({ id: id }, { raised: newRise });
  }

  async removeWish(id: number, ownerId: number): Promise<Wish> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    if (wish.owner.id !== ownerId) {
      throw new NotAcceptableException(`Этот подарок другого пользователя`);
    }

    await this.wishRepository.delete(id);

    return wish;
  }

  async copyWish(id: number, ownerId: number): Promise<Wish> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: false },
    });

    if (!wish) {
      throw new NotFoundException(
        `Подарок #${id} не найден или уже пренадлежит вам`,
      );
    }

    await this.create({ ...wish, raised: 0, copied: 0 }, ownerId);

    return await this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }
}
