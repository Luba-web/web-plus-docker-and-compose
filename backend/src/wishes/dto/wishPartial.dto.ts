import {
  IsDateString,
  IsInt,
  IsString,
  IsUrl,
  Min,
  Length,
  IsOptional,
} from 'class-validator';

export class WishPartialDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsDateString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @Min(1)
  price: number;

  @IsOptional()
  @Min(1)
  raised: number;

  @IsOptional()
  copied: number;

  @IsOptional()
  @IsString()
  @Length(1, 1240)
  description: string;
}
