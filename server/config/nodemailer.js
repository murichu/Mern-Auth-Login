import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_APP_PASS, // Your Gmail App Password
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying transporter:', error);
    } else {
        console.log('Transporter ready to send emails:', success);
    }
});

export default transporter;

// Function to send email
//const sendEmail = async (mailOptions) => {
  //try {
   // const info = await transporter.sendMail(mailOptions);
    //console.log('Email sent successfully:', info.response);
  //} catch (error) {
   // console.error('Error occurred while sending email:', error);
 // }
//};

// Example usage of sendEmail function
//const mailOptions = {
  //from: process.env.EMAIL_USER,
 // to: process.env.EMAIL_USER,
  //subject: 'Test Email from Node.js',
  //text: 'Hello, This is a test email sent from Node.js using Nodemailer',
//};

// Send email
//sendEmail(mailOptions);

//export { sendEmail };
