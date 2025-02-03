import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { userVerificationTemplate } from './templates/user-verification-template';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(configService.get('mail.sendgrid.key'));
  }

  async sendMail(msg) {
    msg.from = this.configService.get('mail.sendgrid.from');
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.log(error);
    }
  }

  async sendUserVerificationLink(emailId: string, verificationId: string) {
    try {
      const activationLink = `${this.configService.get('app.url')}/user/verify/${verificationId}`;

      let emailTemplate = userVerificationTemplate;

      emailTemplate = emailTemplate.replace(
        '{{activationLink}}',
        activationLink,
      );

      const msg = {
        to: emailId,
        subject: 'Verify Your Account',
        text: `Please click on the link to verify your account: ${activationLink}`,
        html: emailTemplate,
      };
      await this.sendMail(msg);
    } catch (error) {
      console.log(error);
    }
  }
}
