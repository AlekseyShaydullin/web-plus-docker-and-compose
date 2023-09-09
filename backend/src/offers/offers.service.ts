import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    id: number,
  ): Promise<Offer> {
    const user = await this.usersService.findOneById(id);
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });
    const newRise = Number(wish.raised) + Number(amount);
    const sum = wish.price - wish.raised;

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'вы не можете вносить деньги на свои подарки',
      );
    }
    if (amount > wish.price) {
      throw new ForbiddenException('сумма взноса больше стоимости подарка');
    }

    if (amount > sum) {
      throw new ForbiddenException(
        'сумма взноса больше оставшейся для сбора суммы на подарок',
      );
    }

    if (wish.raised === wish.price) {
      throw new ForbiddenException('нужная сумма уже собрана');
    }

    console.log(user);

    await this.wishesService.updateRise(itemId, newRise);
    const offerDto = { ...createOfferDto, owner: user, item: wish };
    return await this.offerRepository.save(offerDto);
  }

  async findAll(): Promise<Offer[]> {
    try {
      return this.offerRepository.find({
        relations: {
          item: {
            owner: true,
            offers: true,
          },
          owner: {
            wishes: true,
            wishlists: true,
            offers: true,
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('не удалось получить все заявки');
    }
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException(`Не удалось найти заявку с id: ${id}`);
    }

    return offer;
  }
}
