import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Kode Verifikasi Daurin",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8C1007;">Kode Verifikasi Anda</h2>
        <p>Gunakan kode berikut untuk melanjutkan registrasi:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8C1007; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666;">Kode ini berlaku selama 30 menit.</p>
        <p style="color: #666; font-size: 12px;">Jika Anda tidak melakukan registrasi, abaikan email ini.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
