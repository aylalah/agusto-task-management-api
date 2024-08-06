import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { titleCase } from '../../../utils';
import { date } from '../../../utils/time.utils';
import { IsName } from '../../../utils/validation.util';

export class UpdateUserDto {

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

export class UpdateUserCodeDto {
  @IsString()
  @Length(1, 8)
  @ApiProperty()
  code: string;
}

export class UpdateEmailDto {
  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;
}

export class UpdateReferralCodeDto {
  @IsString()
  @Length(1, 6)
  @ApiProperty()
  referral_code: string;
}

export class UpdatePhoneNumberDto {
  @IsNumberString()
  @Length(1, 11)
  @ApiProperty()
  phone_number: string;
}

export class CreatePinDto {
  @IsNumberString()
  @Length(1, 4)
  @ApiProperty()
  pin: string;
}

export class ChangePinDto {
  @IsNumberString()
  @Length(1, 4)
  @ApiProperty()
  current_pin: string;

  @IsNumberString()
  @Length(1, 4)
  @ApiProperty()
  new_pin: string;

  @IsNumberString()
  @Length(1, 4)
  @ApiProperty()
  confirm_new_pin: string;
}

export class InitiatePinDto {
  @Transform(({ value }) => {
    console.log('date_of_birth', value)
    const dateArr = (value as string)?.split(' ')
    return dateArr && dateArr.length > 0 ? date(dateArr[0], 'YYYY-MM-DD') : null
  })
  @IsDateString()
  @ApiProperty()
  date_of_birth: string;

  @IsNumberString()
  @Length(11, 11)
  @ApiProperty()
  bvn: string;
}

export class UpdatePinDto {
  @IsNumberString()
  @Length(1, 4)
  @ApiProperty()
  pin: string;

  @IsNumberString()
  @Length(1, 6)
  @ApiProperty()
  otp: string;
}

export class InitiateBvnDto {
  @IsNumberString()
  @Length(11, 11)
  @ApiProperty()
  bvn: string;
}

export class UpdateBvnDto {
  @IsNumberString()
  @Length(11, 11)
  @ApiProperty()
  bvn: string;

  @IsNumberString()
  @Length(1, 6)
  @ApiProperty()
  otp: string;
}

export class VerifyBvnDataDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsNumberString()
  @Length(11, 11)
  @ApiProperty()
  bvn: string;

  @IsString()
  @ApiProperty()
  photo: string;

  @IsString()
  @ApiProperty()
  watchListed: string;

  @IsNumberString()
  @ApiProperty()
  responseCode: string;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @ApiProperty()
  middleName: string;

  @Transform(({ value }) => {
    console.log('date_of_birth', value)
    const dateArr = (value as string)?.split(' ')
    return dateArr && dateArr.length > 0 ? date(dateArr[0], 'YYYY-MM-DD') : null
  })
  @IsDateString()
  @ApiProperty()
  date_of_birth: string;

  @IsNumberString()
  @ApiProperty()
  phone_number: string;

  @IsNumberString()
  @ApiProperty()
  phone_number2: string;

  @IsString()
  @ApiProperty()
  enrollmentBank: string;

  @IsString()
  @ApiProperty()
  enrollmentBranch: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  gender: string;

  @IsString()
  @ApiProperty()
  levelOfAccount: string;

  @IsString()
  @ApiProperty()
  lgaOfOrigin: string;

  @IsString()
  @ApiProperty()
  lgaOfResidence: string;

  @IsString()
  @ApiProperty()
  stateOfOrigin: string;

  @IsString()
  @ApiProperty()
  stateOfResidence: string;

  @IsString()
  @ApiProperty()
  maritalStatus: string;

  @IsNumberString()
  @ApiProperty()
  nin: string;

  @IsString()
  @ApiProperty()
  nameOnCard: string;

  @IsString()
  @ApiProperty()
  nationality: string;

  @IsString()
  @ApiProperty()
  residentialAddress: string;

  @IsDateString()
  @ApiProperty()
  registrationDate: string;

  @IsString()
  @ApiProperty()
  similarity: string;

  @IsString()
  @ApiProperty()
  image_validity: string;

  @IsString()
  @ApiProperty()
  image_processed: string;

  @IsDateString()
  @ApiProperty()
  created_at: string;

  @IsDateString()
  @ApiProperty()
  updated_at: string;
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
  email_or_phone_number: string;

  // @IsNumberString()
  // @Length(11, 11)
  // @ApiProperty()
  // bvn: string;
}

export class UpdateResetPasswordDto {
  @IsString()
  @Length(1, 52)
  @ApiProperty()
  email_or_phone_number: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  new_password: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  confirm_new_password: string;

  @IsNumberString()
  @Length(1, 6)
  @ApiProperty()
  otp: string;
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

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class MessageDto {

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  message?: any;

}

export class StatusDto {

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  status: true;

}
