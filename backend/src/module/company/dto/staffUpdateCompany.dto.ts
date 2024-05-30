import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class StaffUpdateCompanyDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isVerify: boolean;
}
