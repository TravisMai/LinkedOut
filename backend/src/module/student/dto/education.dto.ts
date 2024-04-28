import { IsString } from 'class-validator';

export class EducationDTO {
  @IsString()
  school: string;

  @IsString()
  major: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  gpa: string;
}
