import { Entity, Column } from 'typeorm';
import { commonAttribute } from 'src/common/entities/commonAttribute.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

@Entity()
export class Company extends commonAttribute {
  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  workField: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  website: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ nullable: true })
  // @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  taxId: number;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ default: true })
  isActive: boolean;
}
