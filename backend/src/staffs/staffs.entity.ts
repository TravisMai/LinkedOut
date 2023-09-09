import { v4 as uuidv4 } from 'uuid';
import { IsNumber, IsOptional } from "class-validator";
import { commonAttribute } from "src/common/entity/commonAttribute.entity";
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Staff extends commonAttribute {
    @Column({ default: false })
    @IsOptional()
    isAdmin: boolean;

    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    staffId: number;
}