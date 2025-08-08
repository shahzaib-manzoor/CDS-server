import { generateToken } from "./jwt";


import nodemailer from "nodemailer"
const reset_email_tempate = (token:string) => { 
    return `<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Password</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body style="margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: auto;">
        <div style="text-align: center; padding: 20px; color: #161a39; font-weight: 800; font-size: 40px;">
            LOGO
        </div>
        <div style="background-color: #161a39; text-align: center; padding: 20px;">
            <img src="https://i.postimg.cc/Bby8DSny/image-1.png" alt="Reset Password" style="height: 10vh; aspect-ratio: 1/1;">
            <div style="color: white; font-size: 40px; font-weight: 500; padding: 30px;">
                Reset your Password
            </div>
        </div>
        <div style="font-size: 20px; font-weight: 400; padding: 10px; color: gray;">
            <p>Hello,</p>
            <p>We have sent you this email in response to your request to reset your Password on company name.</p>
            <p>To reset your Password please follow the link below:</p>

            <a href=${process.env.SITE_URL}/${token} style="display: inline-block; padding: 10px 20px; background-color: #161a39; color: white; text-decoration: none; margin: 20px 0;">Reset Password</a>
        </div>
    </div>
</body>

</html>`
}


const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Flow</title>
</head>
<body style="background-color: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0; text-align: center;">
    <div style="max-width: 600px; width: 100%; margin: auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="margin-bottom: 20px; font-size: 24px; color: #333;">Welcome to Flow</h1>
        <p style="margin-bottom: 20px; color: #555;">It's time to start getting things done.</p>
        <p style="margin-bottom: 20px; color: #555;">You're now one of the thousands of teams using Flow to manage tasks, have discussions, share files, and capture ideas. Feels good, right? Don't forget to grab <a href="#" style="color: #007bff; text-decoration: none; font-weight: bold;">our apps</a>, and feel free to <a href="#" style="color: #007bff; text-decoration: none; font-weight: bold;">email support</a> if you have any questions.</p>
        <a href="#" style="display: inline-block; background-color: #28a745; color: white; border: none; padding: 12px 24px; font-size: 18px; border-radius: 5px; margin-bottom: 20px; text-decoration: none; font-weight: bold;">Get Started</a>
        <div style="border-top: 1px solid #e0e0e0; margin: 30px 0;"></div>
        <p style="color: #888888; font-size: 14px; margin-bottom: 20px;">There's more to come! We'll be in touch when you've had more time to check Flow out.</p>
        <div style="text-align: center;">
            <a href="#" aria-label="Twitter" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; margin: 0 10px; text-decoration: none;">
                <img src="https://i.ibb.co/r07ST36/twitter-removebg-preview.png" alt="Twitter" style="width: 32px; height: 32px; display: block; margin: auto;">
            </a>
            <a href="#" aria-label="Facebook" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; margin: 0 10px; text-decoration: none;">
                <img src="https://i.ibb.co/6sP842w/facebook-removebg-preview.png" alt="Facebook" style="width: 32px; height: 32px; display: block; margin: auto;">
            </a>
            <a href="#" aria-label="Google Plus" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; margin: 0 10px; text-decoration: none;">
                <img src="https://i.ibb.co/dWCKFFs/google-removebg-preview.png" alt="Google Plus" style="width: 32px; height: 32px; display: block; margin: auto;">
            </a>
            <a href="#" aria-label="App Store" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; margin: 0 10px; text-decoration: none;">
                <img src="https://i.ibb.co/WtCcdNP/App-Store-Logo-2019-removebg-preview.png" alt="App Store" style="width: 32px; height: 32px; display: block; margin: auto;">
            </a>
        </div>
    </div>
</body>
</html>`




class MailUtil {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_SECRET,
            },
        });
    }

    sendEmail(to: string, subject : string = "Hello ✔",text : string = "Hello world?",html ?: string ) {
        this.transporter.sendMail({
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        }).then((val: any) => {
            console.log('---- Mail Sent ---', val)
        }).catch((err: any) => {
            console.log('error===>', err)
        })
    }

    async resetPasswordEmail(to: string) {
        const token =await generateToken({
            email : to
        }, "1h")


        return this.transporter.sendMail({
            from: 'CDS 👻', // sender address
            to: to, // list of receivers
            subject: "Reset password", // Subject line
            text: 'Hello', // plain text body
            html: reset_email_tempate(token), // html body
        })
    }

}

export default MailUtil;