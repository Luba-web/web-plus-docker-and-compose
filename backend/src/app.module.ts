import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { User } from './users/entities/user.enitity';
import { Offer } from './offers/entities/offer.enitity';
import { Wish } from './wishes/entities/wish.enitity';
import { Wishlist } from './wishlists/entities/wishlist.enitity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'database',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'student',
      password: process.env.POSTGRES_PASSWORD || 'student',
      database: process.env.POSTGRES_DB || 'kupipodariday',
      entities: [User, Offer, Wish, Wishlist],
      synchronize: true,
    }),
    UsersModule,
    OffersModule,
    WishesModule,
    WishlistsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
