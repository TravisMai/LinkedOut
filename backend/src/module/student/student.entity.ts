import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { Faculty } from "../faculty/faculty.entity";
import { Transform } from 'class-transformer';

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
  @IsNumber()
  @IsOptional()
  classCode: string;

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  @IsOptional()
  resume: string[];

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  @IsOptional()
  skill: string[];

  @Column({ default: true })
  isActive: boolean;

  // flag keep the status occupation of student ?
  
}