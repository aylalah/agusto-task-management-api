import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class CreateUserDto {

  @IsOptional()
  @IsString()
  @IsEnum(['admin', 'user'])
  @ApiProperty()
  role?: string;

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  first_name: string;

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  last_name: string;

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;
  
  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiProperty()
  phone_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['Male', 'Female'])
  @ApiProperty()
  gender?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  two_factor?: true;

}
