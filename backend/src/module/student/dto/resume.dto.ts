import { IsString } from 'class-validator';

export class ResumeDTO {
    @IsString()
    id: string;
  
    @IsString()
    url: string;
}
