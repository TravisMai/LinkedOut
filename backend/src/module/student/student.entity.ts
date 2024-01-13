import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { Faculty } from "../faculty/faculty.entity";

@Entity()
export class Student extends commonAttribute {
  @ManyToOne(() => Faculty, { eager: true })
  @JoinColumn({ name: 'facultyId' })
  faculty: Faculty;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  studentId: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  gpa: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  classCode: number;

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  @IsOptional()
  resume: string[];

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  @IsOptional()
  skill: string[];
}