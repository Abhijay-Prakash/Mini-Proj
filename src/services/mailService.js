import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    },
});


export const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to,
            subject,
            text,
        };


        console.log("Sending email to:", to);
        console.log("Email Subject:", subject);
        console.log("Email Content:", text);
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};
