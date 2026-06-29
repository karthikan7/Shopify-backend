const nodemailer=require('nodemailer');


const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',        
      port: 465,                     
      secure: true,                 
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify();      
    console.log(' Email connected');

    const mailOptions = {
      from: `"ShopNest Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${email}`);
  } catch (error) {
    console.error(` Email failed: ${error.message}`);
  }
};

module.exports = sendEmail;
