import { IsString } from 'class-validator';

export class ResumeDTO {
    @IsString()
    id: string;

    @IsString()
    title: string;
  
    @IsString()
    url: string;
}
