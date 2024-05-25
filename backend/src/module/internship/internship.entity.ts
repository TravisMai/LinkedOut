import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { JobApplicants } from '../jobApplicants/jobApplicants.entity';
import { Staff } from '../staff/staff.entity';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { InternshipDocumentDTO } from './dto/document.dto';

@Entity()
export class Internship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => JobApplicants, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobApplicantId' })
  jobApplicants: JobApplicants;

  @ManyToOne(() => Staff, { eager: true })
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InternshipDocumentDTO)
  document: InternshipDocumentDTO[];

  @Column({ nullable: true })
  @Transform(({ value }) => parseInt(value))
  result: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated: Date;
}
