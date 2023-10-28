import { Entity, Column } from "typeorm";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

@Entity()
export class Company extends commonAttribute {
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
    @IsNumber()
    @IsOptional()
    taxId: number;

    @Column({ default: false })
    isVerify: boolean;
}