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
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Wish } from './entities/wish.entity';
import { TUserRequest } from '../common/types';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // POST/wishes
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @Request()
    { user }: TUserRequest,
    @Body()
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(createWishDto, user.id);
  }

  // GET/wishes/last
  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  // GET/wishes/top
  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  // GET/wishes/{id}
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findWishByID(@Param('id') id: number): Promise<Wish> {
    console.log(id);

    try {
      return await this.wishesService.findById(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Не удается получить карточку с указанным id: ${id}`,
      );
    }
  }

  // PATCH/wishes/{id}
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateWish(
    @Request()
    { user }: TUserRequest,
    @Param('id')
    id: number,
    @Body()
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.updateWish(id, updateWishDto, user.id);
  }

  // DELETE/wishes/{id}
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeWish(
    @Request()
    { user }: TUserRequest,
    @Param('id')
    id: number,
  ): Promise<Wish> {
    return this.wishesService.removeWish(id, user.id);
  }

  // POST/wishes/{id}/copy
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copyWish(
    @Request() { user }: TUserRequest,
    @Param('id') id: number,
  ): Promise<Wish> {
    return this.wishesService.copyWish(id, user.id);
  }
}
