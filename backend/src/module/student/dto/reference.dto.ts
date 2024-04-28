import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class ReferenceDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
