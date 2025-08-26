import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getOtpEmailTemplate,
} from './templates';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const mailOptions = {
        from: this.configService.get('SMTP_USER'),
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationLink = `${this.configService.get('APP_URL')}/verify-email?token=${token}`;
    const html = getVerificationEmailTemplate(verificationLink);
    return this.sendEmail(to, 'Verify Your Email', html);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${this.configService.get('APP_URL')}/reset-password?token=${token}`;
    const html = getPasswordResetEmailTemplate(resetLink);
    return this.sendEmail(to, 'Reset Your Password', html);
  }

  async sendOtpEmail(to: string, otp: string) {
    const html = getOtpEmailTemplate(otp);
    return this.sendEmail(to, 'Your OTP Code', html);
  }
}
