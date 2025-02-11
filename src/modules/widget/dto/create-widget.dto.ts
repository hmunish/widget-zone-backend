import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxDate, ValidateIf } from "class-validator";
import { Gender } from "src/shared/enums/common.interface";

export class CreateWidgetDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}