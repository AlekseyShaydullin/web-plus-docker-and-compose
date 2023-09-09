import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { TUserRequest } from '../common/types';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  // POST/wishlists
  @Post()
  async create(
    @Request()
    { user }: TUserRequest,
    @Body()
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    try {
      return await this.wishlistsService.createWishlist(
        createWishlistDto,
        user.id,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('ошибка при создании коллекции');
    }
  }

  // GET/wishlists
  @Get()
  async findAll(): Promise<Wishlist[]> {
    try {
      return await this.wishlistsService.findAll();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('коллекции не найдены');
    }
  }

  // GET/wishlists/{id}
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    try {
      return await this.wishlistsService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Не удается получить карточку с указанным id: ${id}`,
      );
    }
  }

  // PATCH/wishlists/{id}
  @Patch(':id')
  update(
    @Request()
    { user }: TUserRequest,
    @Param('id')
    id: number,
    @Body()
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  // DELETE/wishlists/{id}
  @Delete(':id')
  remove(
    @Request()
    { user }: TUserRequest,
    @Param('id')
    id: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.remove(id, user.id);
  }
}
