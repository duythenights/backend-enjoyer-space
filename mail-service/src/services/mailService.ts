import brevo from "../config/mailConfig";

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const sendSmtpEmail = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: process.env.BREVO_SENDER_NAME!,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    console.log("env", process.env.BREVO_API_KEY);
    await brevo.sendTransacEmail(sendSmtpEmail);

    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
}
