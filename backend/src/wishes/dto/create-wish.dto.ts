import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(1)
  @IsPositive()
  price: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsOptional()
  raised: number;

  @IsNumber()
  @IsOptional()
  copied: number;

  @IsString()
  @Length(1, 1024)
  description?: string;
}
