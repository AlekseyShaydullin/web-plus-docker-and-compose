import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { Offer } from '../../offers/entities/offer.entity';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  offers?: Offer[];
}
