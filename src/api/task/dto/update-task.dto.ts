import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
  IsEmail,
  IsEnum,
  isNumberString,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class UpdateTaskDto {
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

    @IsOptional()
    // @IsNumberString()
    @ApiProperty()
    progress;

    @IsOptional()
    @IsString()
    @ApiProperty()
    status: string;

}

export class GetTaskParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  per_page: number = 12;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}