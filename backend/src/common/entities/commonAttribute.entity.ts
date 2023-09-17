import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class commonAttribute {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsNotEmpty()
    @IsPhoneNumber('VN', { message: 'Invalid Vietnamese phone number format' })
    phoneNumber: string;

    @Column({ default: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.18169-9/22046122_1959802640904562_1679173393777949798_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=dPWTi3zQbmoAX8VoMpg&_nc_ht=scontent.fsgn5-6.fna&oh=00_AfC7_ru_iM65YhxCLXX4qX63Bm0eVBmS4AtB1kDBF8Il7w&oe=6528E343" })
    @IsString()
    @IsOptional()
    avatar: string;

    @Column()
    role: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;
}