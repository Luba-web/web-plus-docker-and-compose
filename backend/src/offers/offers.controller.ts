import { Controller, NotFoundException } from '@nestjs/common';
import {
  Body,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateOfferDto } from './dto/createOffer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    if (!offers) throw new NotFoundException('Список подарков не найден');
    return offers;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.offersService.findById(id);
  }

  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.create(req.user, createOfferDto);
  }
}
