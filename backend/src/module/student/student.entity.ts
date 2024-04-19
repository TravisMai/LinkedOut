import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl, Length, ValidateNested } from "class-validator";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { Faculty } from "../faculty/faculty.entity";
import { Transform, Type } from 'class-transformer';
import { EducationDTO } from "./dto/education.dto";
import { WorkingHistoryDTO } from "./dto/workingHistory.dto";
import { CertificateDTO } from "./dto/certificate.dto";
import { SkillDTO } from "./dto/skill.dto";
import { AdditionalInformationDTO } from "./dto/additionalInfo.dto";
import { ReferenceDTO } from "./dto/reference.dto";

@Entity()
export class Student extends commonAttribute {
  @ManyToOne(() => Faculty, { eager: true })
  @JoinColumn({ name: 'facultyId' })
  faculty: Faculty;

  @Column({ default: false })
  isVerify: boolean;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Column({ nullable: true })
  studentId: number;

  @Transform(({ value }) => parseInt(value))
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  gpa: number;

  @Transform(({ value }) => parseInt(value))
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  year: number;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  major: string;

  @Column({ nullable: true })
  @IsOptional()
  classCode: string;

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  @IsOptional()
  resume: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: "Recieved" })
  process: string;

  @Column({ type: 'jsonb', nullable: true })
  @ValidateNested()
  socialMedia: {
    github: string;
    linkedin: string;
    google: string;
    facebook: string;
    twitter: string;
  };

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  objective: string;

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EducationDTO)
  education: EducationDTO[];

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHistoryDTO)
  workingHistory: WorkingHistoryDTO[];

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificateDTO)
  certificate: CertificateDTO[];

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SkillDTO)
  skill: SkillDTO[];

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditionalInformationDTO)
  additionalInformation: AdditionalInformationDTO[];

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDTO)
  reference: ReferenceDTO[];
}
