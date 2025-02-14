import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AddUserWidgetPropertyDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
    message:
      'Invalid domain. Enter only the domain name (e.g., widgetzone.com)',
  })
  property: string;
}
