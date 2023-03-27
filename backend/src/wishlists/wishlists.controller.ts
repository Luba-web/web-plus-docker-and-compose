import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';
import { Wishlist } from './entities/wishlist.enitity';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtAuthGuard)
// странный путь
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsService.findAll();
    wishlists.forEach((item) => {
      delete item.owner.email;
    });
    return wishlists;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);
    delete wishlist.owner.email;
    return wishlist;
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (req.user.id === wishlist.owner.id) {
      return await this.wishlistsService.update(+id, updateWishlistDto);
    } else {
      throw new NotFoundException('Этот лист вам не принадлежит');
    }
  }

  @Delete(':id')
  async removeById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (wishlist.owner.id !== req.user.id) {
      throw new NotFoundException('Этот лист вам не принадлежит');
    }

    await this.wishlistsService.removeById(id);
    return wishlist.owner.id;
  }
}
