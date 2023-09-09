import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
