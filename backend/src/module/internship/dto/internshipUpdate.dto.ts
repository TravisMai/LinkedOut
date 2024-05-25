import { IsOptional, IsString, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { InternshipDocumentDTO } from './document.dto';

export class InternshipUpdateDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  result: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deleteDocumentID: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InternshipDocumentDTO)
  document: InternshipDocumentDTO[];

  @IsString()
  @IsOptional()
  documentName: string;
}
