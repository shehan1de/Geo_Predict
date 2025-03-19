const nodemailer = require("nodemailer");
const path = require("path");

const sendResetEmail = async (to, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Correct local file path for attachment
        const logoPath = path.join(__dirname, "../image/logo.png");  // Adjusted file path

        const mailOptions = {
            from: `"GeoPredict Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "🔑 Password Reset Request - GeoPredict",
            text: `Hello,\n\nYour password reset code is: ${resetToken}.\n\nIf you didn’t request this, please ignore it.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:geopredictlogo" alt="GeoPredict Logo" style="width: 120px; height: auto;">
                    </div>
                    <h2 style="color: #333; text-align: center;">🔑 Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Use the verification code below to proceed:</p>
                    <div style="text-align: center; background: #007bff; color: white; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px; width: fit-content; margin: auto;">
                        ${resetToken}
                    </div>
                    <p style="margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
                    <p><strong>GeoPredict Team</strong></p>
                    <hr>
                    <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
                </div>
            `,
            attachments: [
                {
                    filename: "logo.png",
                    path: logoPath,  // Correct file path
                    cid: "geopredictlogo", // Must match img src="cid:geopredictlogo"
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending reset email:", error);
    }
};

module.exports = sendResetEmail;
