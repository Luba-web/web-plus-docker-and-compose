import { PartialType } from '@nestjs/swagger';
import { WishPartialDto } from './wishPartial.dto';

export class UpdateWishDto extends PartialType(WishPartialDto) {}
