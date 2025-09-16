async function sendOtp(OTP, recipientEmail) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: recipientEmail,
    subject: 'OTP for email verification',
    html: ``
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email Sent:', info.response);
    return;
  } catch (error) {
    next(error);
  }
}