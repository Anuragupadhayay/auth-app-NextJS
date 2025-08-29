import nodemailer from "nodemailer"
import User from "@/models/userModels"
import bcrypt from "bcryptjs"
import { Html } from "next/document"

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        //create a hashed token
        const hashedToken = bcrypt.hash(userId.toString(), 10)

        if (emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        }
        else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashedToken}, {forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.N_USER,
            pass: process.env.N_PASS
          }
        });

        const mailOptions = {
            from: "anuragu901@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Hi! Verify your email!" : "Reset Your Password",
            Html: `<p>Click <a href="${process.env.DOMAIN}/verfiyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "reset your password"} </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions)
        return mailresponse;

    } catch (error: any) {
        throw new Error(error.message)
    }
}