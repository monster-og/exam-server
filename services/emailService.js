const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendResultsEmail(filePath, resultsCount) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const fileName = filePath.split(/[\\/]/).pop();
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const mailOptions = {
    from: `"Exam Server 🏫" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `📊 Exam Results Report — ${now}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f7ff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏫 Exam Results Report</h1>
          <p style="color: #c4b5fd; margin: 8px 0 0 0;">Generated on ${now}</p>
        </div>
        <div style="padding: 30px;">
          <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h2 style="color: #4f46e5; margin: 0 0 12px 0; font-size: 18px;">📋 Summary</h2>
            <p style="margin: 0; color: #374151; font-size: 16px;">Total exam submissions in this report: <strong style="color: #4f46e5;">${resultsCount}</strong></p>
          </div>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
            <p style="margin: 0; color: #166534;">✅ Please find the detailed Excel report attached. It contains class-wise sheets with individual student scores, grades, and timestamps.</p>
          </div>
        </div>
        <div style="background: #1e1b4b; padding: 16px; text-align: center;">
          <p style="color: #818cf8; margin: 0; font-size: 13px;">Sent by Exam Server • Oxford Convent School Sasaram (Class 1–12 Examination System)</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: fileName,
        path: filePath,
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendResultsEmail };
