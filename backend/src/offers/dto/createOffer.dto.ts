import { IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  @IsNumber()
  itemId: number;
}
