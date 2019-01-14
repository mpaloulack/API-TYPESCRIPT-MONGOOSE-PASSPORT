import nodemailer = require("nodemailer");
import dotenv = require("dotenv");
dotenv.config();

export class Email {

    /**
     *
     * @param emailTo
     * @param subject
     * @param html
     */
    public emailSend(emailTo: string, subject: string, html: string) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: emailTo,
            subject,
            html,
        };

        // tslint:disable-next-line:only-arrow-functions
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                // tslint:disable-next-line:no-console
                console.log(err);
                return false;
            }

            // tslint:disable-next-line:no-console
            console.log(info);
            return true;

        });
    }
}
