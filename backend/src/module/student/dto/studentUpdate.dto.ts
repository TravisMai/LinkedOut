import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ResumeDTO } from './resume.dto';
import { AdditionalInformationDTO } from './additionalInfo.dto';
import { CertificateDTO } from './certificate.dto';
import { EducationDTO } from './education.dto';
import { ReferenceDTO } from './reference.dto';
import { SkillDTO } from './skill.dto';
import { WorkingHistoryDTO } from './workingHistory.dto';

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
  @Transform(({ value }) => parseInt(value))
  studentId: number;

  @IsString()
  @IsOptional()
  process: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isVerify: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
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

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  gpa: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  year: number;

  @IsOptional()
  @IsString()
  major: string;

  @IsString()
  @IsOptional()
  classCode: string;

  @ValidateNested()
  socialMedia: {
    github: string;
    linkedin: string;
    google: string;
    facebook: string;
    twitter: string;
  };

  @IsString()
  @IsOptional()
  objective: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EducationDTO)
  education: EducationDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHistoryDTO)
  workingHistory: WorkingHistoryDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificateDTO)
  certificate: CertificateDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SkillDTO)
  skill: SkillDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditionalInformationDTO)
  additionalInformation: AdditionalInformationDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDTO)
  reference: ReferenceDTO[];
}
