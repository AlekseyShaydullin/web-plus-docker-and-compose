import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Offer } from './entities/offer.entity';
import { TUserRequest } from '../common/types';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // POST/offers
  @Post()
  create(
    @Request()
    { user }: TUserRequest,
    @Body()
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return this.offersService.createOffer(createOfferDto, user.id);
  }

  // GET/offers
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  // GET/offers/{id}
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
