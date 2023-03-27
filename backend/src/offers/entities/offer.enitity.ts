import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';
import { User } from 'src/users/entities/user.enitity';
import { Wish } from 'src/wishes/entities/wish.enitity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({
    scale: 2,
    default: 0,
  })
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
