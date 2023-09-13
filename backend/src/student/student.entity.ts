import { Entity, Column } from "typeorm";
import { IsNumber, IsOptional } from "class-validator";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";

@Entity()
export class Student extends commonAttribute {
  @Column({ default: false })
  isGoogle: boolean;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  studentId: number;
}