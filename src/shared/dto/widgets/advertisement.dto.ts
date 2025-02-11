import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
} from 'class-validator';

class Styles {
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  bgColor: string;
}

export class Advertisement {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Styles)
  styles: Styles;
}
