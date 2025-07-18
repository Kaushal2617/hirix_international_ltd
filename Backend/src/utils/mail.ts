import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to: string, subject: string, html: string) => {
  const data = await resend.emails.send({
    from: process.env.SMTP_FROM || 'onboarding@resend.dev',
    to,
    subject,
    html,
  });
  return data;
};
