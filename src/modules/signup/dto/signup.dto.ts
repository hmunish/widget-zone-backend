import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxDate, ValidateIf } from "class-validator";
import { Gender } from "src/shared/enums/common.interface";

export class SignupDto{
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

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
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must be at least 8 characters long, include at least one letter, one number, and one special character',
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