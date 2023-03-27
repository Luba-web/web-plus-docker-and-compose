import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
