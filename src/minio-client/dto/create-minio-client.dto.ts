
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { IsName } from './../../utils/validation.util';

export class CreateMinioClientDto {
  
    @IsOptional()
    @IsString()
    @ApiProperty()
    base64: string;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    @ApiProperty()
    image_name: string;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    @ApiProperty()
    bucket_name: string;

}

export class MakeBucketDto {

  @IsOptional()
  @IsString()
  @Length(1, 200)
  @ApiProperty()
  bucket: string;

}

export class CreateMinioCSVDto {
  
  @IsOptional()
  @IsArray()
  @ApiProperty()
  data: [];

  @IsOptional()
  @IsString()
  @Length(1, 200)
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  @ApiProperty()
  path: string;

}