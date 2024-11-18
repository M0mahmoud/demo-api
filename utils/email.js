const OTP = require("../models/OTP");
const { hash } = require("bcryptjs");

// TODO: Make it more reusable
async function sendOTPEmail(email, otp) {
    let text = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
    <h2>Email Verification</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
    <p>This code will expire in 5 minutes.</p>
    <p>If you didn't request this code, please ignore this email.</p>
    </div>
`;
    let subject = "Your Verification Code";
    const formData = new FormData();
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("text", text);
    try {
        const response = await fetch(`${process.env.EMAIL_FORM_URL}`, {
            method: "POST",
            body: new URLSearchParams(formData),
        });
        const data = await response.text();

        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Handle OTP generation and email sending
async function handleOTP(email) {
    const otp = generateOTP();
    const hashedOTP = await hash(otp, 12);

    await OTP.findOneAndUpdate(
        { email },
        { otp: hashedOTP },
        { upsert: true, new: true },
    );

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
        throw new Error("Failed to send OTP email.");
    }
}

module.exports = { handleOTP };
