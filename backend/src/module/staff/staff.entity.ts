import { Entity, Column } from "typeorm";
import { IsNumber, IsOptional } from "class-validator";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";

@Entity()
export class Staff extends commonAttribute {
    @Column({ default: false })
    isAdmin: boolean;

    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    staffId: number;
}