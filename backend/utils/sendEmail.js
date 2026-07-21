import nodemailer from "nodemailer"


export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SMTP_SERVICE,
        auth: {
            user: process.env.NODEMAILER_EMAIL, 
            pass: process.env.NODEMAILER_PASSWORD
        }
    })
    const mailOptions = {
        from : process.env.NODEMAILER_SMTP_SERVICE, 
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}