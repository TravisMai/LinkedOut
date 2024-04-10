import { IsString } from 'class-validator';

export class SkillDTO {
    @IsString()
    name: string;
  
    @IsString()
    level: string;
}