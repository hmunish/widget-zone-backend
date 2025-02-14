import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class SigninDto {
  @ValidateIf((o) => !o.emailId)
  @IsNotEmpty()
  @IsString()
  @Matches(/^[1-9][0-9]{9}$/)
  mobileNumber: string;

  @ValidateIf((o) => !o.mobileNumber)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  emailId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
