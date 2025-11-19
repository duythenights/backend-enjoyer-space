import { transporter } from "../config/mailConfig";

export async function sendMail(to: string, subject: string, body: string) {
  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: body,
  });

  console.log(`📧 Email sent to ${to}`);
}
