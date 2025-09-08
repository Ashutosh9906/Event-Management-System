import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASS,
    }
});

async function sendOtp(OTP, recipientEmail) {
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: recipientEmail,
        subject: 'OTP for email verification',
        html: `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .otp {
        display: inline-block;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #111827;
        background: #f3f4f6;
        padding: 12px 20px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .footer {
        background: #f4f4f7;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888888;
      }
      .footer a {
        color: #4f46e5;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Email Verification</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>
          Use the One-Time Password (OTP) below to verify your email address:
        </p>

        <div class="otp">${OTP}</div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.  
          Please do not share it with anyone.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          &copy; 2025 MyApp. All rights reserved.<br />
          Need help? <a href="mailto:support@myapp.com">Contact Support</a>
        </p>
      </div>
    </div>
  </body>
</html>
`
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email Sent:', info.response);
        return;
    } catch (error) {
        next(error);
    }
};

export {
    sendOtp
}