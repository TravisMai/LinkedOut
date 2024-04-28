import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNumber, IsOptional } from 'class-validator';
import { commonAttribute } from 'src/common/entities/commonAttribute.entity';
import { Faculty } from '../faculty/faculty.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Staff extends commonAttribute {
  @ManyToOne(() => Faculty, { eager: true })
  @JoinColumn({ name: 'facultyId' })
  faculty: Faculty;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  staffId: number;
}
