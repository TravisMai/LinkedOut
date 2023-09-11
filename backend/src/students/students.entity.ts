import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Entity()
export class Student extends commonAttribute {
    @Column()
    @IsNumber()
    @IsNotEmpty()
    studentId: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @BeforeInsert()
    async beforeInsert() {
        this.name = this.firstName + " " + this.lastName;
    }
}