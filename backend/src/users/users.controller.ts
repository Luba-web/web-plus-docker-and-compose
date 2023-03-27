import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { WishesService } from '../wishes/wishes.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserPublicProfileResponse } from './dto/userPublicProfileResponse.dto';
import { User } from './entities/user.enitity';
import { UsersService } from './users.service';
import { FindUsersDto } from './dto/findUsers.dto';
import { Delete, Param } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { UserProfileResponse } from './dto/userProfileResponse.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @Get('me')
  async me(@Req() req): Promise<UserPublicProfileResponse> {
    return await this.usersService.findById(req.user.id);
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @Patch('me')
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponse> {
    await this.usersService.update(req.user.id, updateUserDto);
    const user = await this.usersService.findByName(req.user.username);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  @Post('find')
  async findMany(@Body() user: FindUsersDto) {
    return this.usersService.findMany(user);
  }

  @Get(':username')
  async findUserByName(@Param('username') username: string) {
    return await this.usersService.findByName(username);
  }

  @Get('me/wishes')
  findWishesId(@Req() req) {
    return this.wishesService.findWishes(req.user.id);
  }

  @Get(':username/wishes')
  async findWishesName(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);
    if (!user) throw new NotFoundException();
    return await this.wishesService.findWishes(user.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    return this.usersService.remove(id);
  }
}
