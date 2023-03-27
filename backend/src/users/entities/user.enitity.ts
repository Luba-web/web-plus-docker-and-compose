import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.enitity';
import { Offer } from 'src/offers/entities/offer.enitity';
import { Wishlist } from 'src/wishlists/entities/wishlist.enitity';

@Entity()
export class User {
  @IsInt()
  @Min(0)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsString()
  @Length(1, 64) // из Api документации
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  password: string;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  // список желаемых подарков. Используйте для него соответствующий тип связи
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // содержит список подарков, на которые скидывается пользователь. Установите для него подходящий тип связи
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // содержит список подарков, на которые скидывается пользователь. Установите для него подходящий тип связи
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
