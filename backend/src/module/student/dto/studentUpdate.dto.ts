import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class StudentUpdateDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsPhoneNumber('VN')
    @IsOptional()
    phoneNumber: string;
    
    @IsString()
    @IsOptional()
    avatar: string;

    @IsNumber()
    @IsOptional()
    studentId: number;

    @IsBoolean()
    @IsOptional()
    isVerify: boolean;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
