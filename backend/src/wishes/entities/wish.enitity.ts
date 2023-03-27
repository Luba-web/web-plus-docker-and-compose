import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsString, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.enitity';
import { Offer } from 'src/offers/entities/offer.enitity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1024)
  description: string;

  @Column({
    default: 0,
  })
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
