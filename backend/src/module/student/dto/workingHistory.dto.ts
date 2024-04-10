import { IsString } from 'class-validator';

export class WorkingHistoryDTO {
    @IsString()
    company: string;
  
    @IsString()
    position: string;
  
    @IsString()
    time: string;
  
    @IsString()
    task: string;
}