import nodemailer, {
    type Transporter,
    type SendMailOptions as NodemailerSendMailOptions,
} from 'nodemailer';
import { env } from '../../config/env.js';

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    replyTo?: string;
    attachments?: NodemailerSendMailOptions['attachments'];
}

export const mailTransporter: Transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    ...(env.SMTP_USER && env.SMTP_PASS
        ? {
              auth: {
                  user: env.SMTP_USER,
                  pass: env.SMTP_PASS,
              },
          }
        : {}),
});

/**
 * Sends an email using the configured Nodemailer transporter.
 */
export async function sendMail(options: SendMailOptions) {
    const from = options.from || env.EMAIL_FROM;

    return await mailTransporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
        attachments: options.attachments,
    });
}

/**
 * Verifies the connection configuration with the SMTP server.
 */
export async function verifyMailConnection(): Promise<boolean> {
    try {
        await mailTransporter.verify();
        return true;
    } catch (error) {
        console.error('SMTP Connection verification failed:', error);
        return false;
    }
}
