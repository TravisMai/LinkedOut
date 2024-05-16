import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { Student } from '../student/student.entity';
import { Job } from '../job/job.entity';
import { ResumeDTO } from '../student/dto/resume.dto';

@Entity()
export class JobApplicants {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Job, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  resume: ResumeDTO;

  @Column({ default: 'Applied' })
  @IsString()
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated: Date;
}
