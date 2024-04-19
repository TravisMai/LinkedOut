import { IsString } from 'class-validator';

export class CertificateDTO {
    @IsString()
    name: string;
    
    @IsString()
    issuedBy: string;

    @IsString()
    time: string;
}
