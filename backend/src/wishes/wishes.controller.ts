import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';
import { Wish } from './entities/wish.enitity';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('top')
  async findTop(): Promise<Wish[]> {
    const users = await this.wishesService.findTop();
    users.forEach((item) => {
      delete item.owner.email;
    });
    return users;
  }

  @Get('last')
  async findLast(): Promise<Wish[]> {
    const users = await this.wishesService.findLast();
    users.forEach((item) => {
      delete item.owner.email;
    });
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(req.user, createWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findById(id);
    if (req.user.id !== wish.owner.id) {
      throw new NotFoundException('У вас нет прав');
    }
    await this.wishesService.update(id, updateWishDto);
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findById(id);
    if (wish.offers.length) {
      throw new BadRequestException(
        'Сумма сбора больше 0, этот подарок нельзя удалить!',
      );
    }
    if (req.user.id !== wish.owner.id) {
      throw new NotFoundException('У вас нет прав');
    }
    await this.wishesService.removeById(id);

    delete wish.owner.email;
    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findById(id);
    const { name, link, price, owner } = wish;
    if (req.user.id === wish.owner.id) {
      throw new NotFoundException('Вы не можете копировать свой подарок');
    }
    if (wish.copied > 0) {
      const isExist = (await this.wishesService.findOne({
        where: {
          name,
          link,
          price,
          owner: { id: owner.id },
        },
        relations: { owner: true },
      }))
        ? true
        : false;
      if (isExist) {
        throw new ForbiddenException('Вы уже копировали себе этот подарок');
      }
    }
    const copyWish = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    await this.wishesService.create(req.user, copyWish);
    await this.wishesService.update(wish.id, { copied: wish.copied + 1 });

    return {};
  }
}
