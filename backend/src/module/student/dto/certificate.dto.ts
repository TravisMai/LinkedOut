import { IsString } from 'class-validator';

export class CertificateDTO {
    @IsString()
    name: string;
  
    @IsString()
    time: string;
}