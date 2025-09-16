import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASS,
  }
});

async function sendEmail(recipientEmail, { subject, html }) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: recipientEmail,
    subject,
    html
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email Sent:', info.response);
    return;
  } catch (error) {
    next(error);
  }
}

export {
  sendEmail
}

