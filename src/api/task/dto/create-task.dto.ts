import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class CreateTaskDto {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    @ApiProperty()
    project: string;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    @ApiProperty()
    task: string;

    @IsOptional()
    @IsString()
    @IsEnum(['', 'Design', 'Development', 'QA', 'Product'])
    @ApiProperty()
    category: string;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    @ApiProperty()
    description: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    comment: string;
    
    @IsOptional()
    @IsArray()
    @ApiProperty()
    assigned_to?: [];

    @IsOptional()
    @IsString()
    @IsEnum(['V.High', 'High', 'Medium', 'Low'])
    @ApiProperty()
    priority: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    start_date?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    due_date: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    attachment: string;

}