import { User } from "@prisma/client";
import nodemailer, { SentMessageInfo } from "nodemailer";

// Define the email options interface
export const sendEmail = (user: User, token: string) => {
  interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Deine Gmail-Adresse
      pass: process.env.PASS, // Dein App-Passwort oder dein Gmail-Passwort
    },
  });

  // Test the connection
  transporter.verify((error: Error | null, success: boolean) => {
    if (error) {
      console.error("Connection test failed:", error);
    } else {
      console.log(
        "Connection test successful! Server is ready to send emails."
      );
    }
  });

  // Email options
  const mailOptions: MailOptions = {
    from: "horstholler6@gmail.com", // Sender address
    to: "jbantin@gmx.de", // Recipient address
    subject: "verify your email", // Subject line
    text: `Hey ${user.name}.Please verify your email address for 'geld ist weg'`, // Plain text body
    html: `<h1>Please verify this Email address for 'geld ist weg'</h1><button style="background:black;color:white;border-radius:6px;padding:0.5rem;margin:1rem"><a style="color:white;font-size:1.5rem;font-weight:900" href='http://localhost:5173/verify_email/${token}'>verify</a></button>`, // HTML body
  };

  // Send the email
  transporter.sendMail(
    mailOptions,
    (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
};
