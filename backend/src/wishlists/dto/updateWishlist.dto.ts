import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './createWishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}
