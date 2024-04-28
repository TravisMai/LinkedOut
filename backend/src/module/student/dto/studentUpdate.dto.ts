import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ResumeDTO } from './resume.dto';

export class StudentUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber('VN')
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsNumber()
  @IsOptional()
  studentId: number;

  @IsBoolean()
  @IsOptional()
  isVerify: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deleteResumeID: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ResumeDTO)
  resume: ResumeDTO[];

  @IsString()
  @IsOptional()
  resumeObjective: string;
}
