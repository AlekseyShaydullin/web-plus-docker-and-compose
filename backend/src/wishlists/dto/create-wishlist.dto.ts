import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(0, 1500)
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
