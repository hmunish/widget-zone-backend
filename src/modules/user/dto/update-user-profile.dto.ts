import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  ValidateIf,
} from 'class-validator';
import { Gender } from 'src/shared/enums/common.interface';

export class UpdateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include at least one letter, one number, and one special character',
  })
  password: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date())
  dob: Date;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
