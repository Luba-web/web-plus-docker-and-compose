import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.enitity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FindUsersDto } from './dto/findUsers.dto';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UserPublicProfileResponse } from './dto/userPublicProfileResponse.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    return this.userRepository.save(createdUser);
  }

  async findById(
    id: number,
    password = false,
  ): Promise<UserPublicProfileResponse> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(password ? 'user.password' : '')
      .where('user.id = :id', { id })
      .getOne();
    return user;
  }

  async findByName(username: string, password = false) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(password ? 'user.password' : '')
      .where('user.username = :username', { username })
      .getOne();
    return user;
  }

  async remove(id: number) {
    return this.userRepository.delete({ id });
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username || updateUserDto.email) {
      const { username, email } = updateUserDto;
      const isExist = (await this.findOne({
        where: [{ email }, { username }],
      }))
        ? true
        : false;
      if (isExist)
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
    }
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('Пользователь не найден');

    if (updateUserDto.password) {
      const password = await bcrypt.hash(updateUserDto.password, 10);
      return this.userRepository.update(id, {
        ...updateUserDto,
        password,
      });
    }

    return await this.userRepository.update(id, updateUserDto);
  }

  async findMany({ query }: FindUsersDto) {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }
}
