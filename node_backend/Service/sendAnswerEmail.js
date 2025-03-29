const nodemailer = require("nodemailer");
const path = require("path");

const sendAnswerEmail = async (to, queryId, question, answer) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const logoPath = path.join(__dirname, "../image/logo.png");

        const mailOptions = {
            from: `"GeoPredict Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: `Answered to your Question - GeoPredict`,
            text: `Hello,\n\nYour query (Question: ${question}) has been answered. Here's the response:\n\n${answer}\n\nIf you have any further questions, feel free to contact us.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;
                background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:geopredictlogo" alt="GeoPredict Logo" style="width: 120px; height: auto;">
                    </div>
                    <h2 style="color: #333; text-align: center;">Answered your Question</h2>
                    <p>Hello,</p>
                    <p>We have received your question and it has been answered. Here's the original question and our response</p>
                    <div style="background: #f1f1f1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p><strong>Original Question</strong></p>
                        <p>${question}</p>
                    </div>
                    <div style="background: #f1f1f1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p><strong>Answer</strong></p>
                        <p>${answer}</p>
                    </div>
                    <p>If you have any further questions, feel free to contact us.</p>
                    <p><strong>GeoPredict Team</strong></p>
                    <hr>
                    <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
                </div>
            `,
            attachments: [
                {
                    filename: "logo.png",
                    path: logoPath,
                    cid: "geopredictlogo",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`Answer email sent successfully to ${to}`);
    } catch (error) {
        console.error("Error sending answer email:", error);
    }
};

module.exports = sendAnswerEmail;
