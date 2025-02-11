import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AddUserWidgetSubscriberDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail(
    {},
    {
      message:
        'Invalid email address. Enter a valid email (e.g., user@example.com)',
    },
  )
  emailId: string;
}
