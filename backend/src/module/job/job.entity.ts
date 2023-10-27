import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { commonAttribute } from "src/common/entities/commonAttribute.entity";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, Min } from "class-validator";
import { PostDescription } from "src/common/interfaces/postDescription.interface";
import { Company } from "../company/company.entity";
import { CompanyResponseDto } from "../company/dto/companyResponse.dto";

@Entity()
export class Job {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Company, { eager: true })
    @JoinColumn({ name: 'companyId' })
    company: CompanyResponseDto;

    @Column()
    @IsString()
    @IsNotEmpty()
    @Length(5, 35)
    title: string;

    @Column('text', { array: true, nullable: true })
    @IsString({ each: true })
    @IsOptional()
    image: string[];

    @Column({ nullable: true })
    @IsOptional()
    @IsNumber()
    salary: number;

    @Column({ default: "No requirement" })
    @IsOptional()
    @IsString()
    level: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    workType: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    @Min(0, { message: "Quantity must be a positive number" })
    quantity: number;

    @Column('json', { nullable: true })
    @IsOptional()
    descriptions: PostDescription;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;
}