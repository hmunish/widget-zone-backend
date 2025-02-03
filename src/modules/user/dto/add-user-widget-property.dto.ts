import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AddUserWidgetPropertyDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, {
    message: 'Invalid website URL.',
  })
  property: string;
}
