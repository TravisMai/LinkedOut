import { IsOptional, IsString } from 'class-validator';

export class ApplyJobDTO {
  @IsString()
  @IsOptional()
  resumeId: string;
}
