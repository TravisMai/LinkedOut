import { IsString } from 'class-validator';

export class AdditionalInformationDTO {
    @IsString()
    name: string;
  
    @IsString()
    level: string;
}
