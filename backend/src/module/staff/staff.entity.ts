import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsNumber, IsOptional } from "class-validator";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { Faculty } from "../faculty/faculty.entity";

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
    staffId: number;
}