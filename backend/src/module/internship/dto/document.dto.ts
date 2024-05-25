import { IsString } from 'class-validator';

export class InternshipDocumentDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  url: string;
}
