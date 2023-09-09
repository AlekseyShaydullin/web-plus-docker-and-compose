import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class SigningUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
