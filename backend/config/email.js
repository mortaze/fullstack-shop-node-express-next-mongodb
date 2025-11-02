

require('dotenv').config();
const nodemailer = require('nodemailer');
const { secret } = require('./secret');

// sendEmail
module.exports.sendEmail = async (body) => {
  try {
    // پیکربندی SMTP
    const transporter = nodemailer.createTransport({
      host: secret.email_host,            // مثال: sandbox.smtp.mailtrap.io
      port: Number(secret.email_port),    // مثال: 2525 یا 587
      secure: Number(secret.email_port) === 465, // فقط پورت 465 SSL است
      auth: {
        user: secret.email_user,
        pass: secret.email_pass,
      },
    });

    // بررسی اتصال به سرور SMTP
    await transporter.verify();
    console.log('✅ Mail server ready');

    // ارسال ایمیل
    const info = await transporter.sendMail(body);
    console.log(`✅ Email sent: ${info.response}`);

    return info;
  } catch (err) {
    console.log(`❌ Error with mail server or sending email: ${err.message}`);
    throw err; // پرتاب خطا برای مدیریت در بالادست
  }
};
 