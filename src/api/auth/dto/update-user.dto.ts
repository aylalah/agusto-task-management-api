import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { titleCase } from '../../../utils';
import { date } from '../../../utils/time.utils';
import { IsName } from '../../../utils/validation.util';

export class UpdateProfileDto {

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

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  username: string;

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;

}

export class LoginUserDto {

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  password: string;

}

export class RefreshTokenDto {

  @IsString()
  @ApiProperty()
  token: string;

}

export class InitiateEmailDto {
  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;
}

export class UpdateEmailDto {

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  old_email: string;

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  new_email: string;

  @IsNumberString()
  @Length(1, 6)
  @ApiProperty()
  otp: string;

  @IsOptional()
  @IsNumberString()
  @Length(1, 4)
  @ApiPropertyOptional()
  pin?: string;

}

export class ChangeResetPasswordDto {
  @IsString()
  @Length(1, 26)
  @ApiProperty()
  current_password: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  new_password: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  confirm_new_password: string;
}

export class InitiateResetPasswordDto {
  @IsString()
  @Length(1, 52)
  @ApiProperty()
  email: string;

  // @IsNumberString()
  // @Length(11, 11)
  // @ApiProperty()
  // bvn: string;
}

export class UpdateResetPasswordDto {
  @IsString()
  @Length(1, 52)
  @ApiProperty()
  email: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  new_password: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  confirm_new_password: string;

  // @IsNumberString()
  // @Length(1, 6)
  // @ApiProperty()
  // otp: string;
}

export class FindUserDto {
  @IsOptional()
  @Transform(({ value }) => '' + value)
  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsOptional()
  @IsString()
  @Length(1, 8)
  @ApiPropertyOptional()
  customer_id?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 52)
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 52)
  @ApiPropertyOptional()
  external_email?: string;
}

export class AccountDto {

  @IsString()
  @Length(1, 36)
  @ApiProperty()
  merchant_id: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNumberString()
  @Length(1, 11)
  @ApiProperty()
  phone_number: string;

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

}