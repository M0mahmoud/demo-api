const Jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const User = require("../models/User");

const HttpStatus = require("../utils/http");
const { handleOTP } = require("../utils/email");
const OTP = require("../models/OTP");

async function signIn(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(422).json({
                status: HttpStatus.FAIL,
                data: { msg: "User with this email not found!" },
            });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(422).json({
                status: HttpStatus.FAIL,
                data: { msg: "Incorrect password!" },
            });
        }

        await handleOTP(email);
        return res.status(200).json({
            status: HttpStatus.SUCCESS,
            data: { msg: "OTP sent successfully. Verify to proceed." },
        });
    } catch (err) {
        console.error("Error during sign-in:", err.message);
        next(err);
    }
}
async function signUp(req, res, next) {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                status: HttpStatus.FAIL,
                data: {
                    msg: "All fields (name, email, password) are required.",
                },
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await handleOTP(email);
            return res.status(422).json({
                status: HttpStatus.FAIL,
                data: { msg: "Email already registered. Please sign in." },
            });
        }

        const hashedPassword = await hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        const token = Jwt.sign(
            { email: savedUser.email, userId: String(savedUser._id) },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        return res.status(201).json({
            status: HttpStatus.SUCCESS,
            data: {
                token,
                userId: String(savedUser._id),
                name: savedUser.name,
                email: savedUser.email,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(422).json({
                status: HttpStatus.FAIL,
                data: { msg: "Email already registered. Please sign in." },
            });
        }
        console.error("Error during sign-up:", err.message);
        next(err);
    }
}
async function verifyOTP(req, res, next) {
    const { email, otp } = req.body;

    try {
        const storedOTP = await OTP.findOne({ email });
        if (!storedOTP) {
            return res.status(400).json({
                status: HttpStatus.FAIL,
                data: { msg: "OTP expired or invalid" },
            });
        }

        const isValidOTP = await compare(otp, storedOTP.otp);
        if (!isValidOTP) {
            return res.status(400).json({
                status: HttpStatus.FAIL,
                data: { msg: "Invalid OTP" },
            });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                status: HttpStatus.FAIL,
                data: { msg: "Email not found. Please sign up." },
            });
        }

        await OTP.deleteOne({ email });

        const token = Jwt.sign(
            { email: existingUser.email, userId: String(existingUser._id) },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        return res.status(201).json({
            status: HttpStatus.SUCCESS,
            data: {
                token,
                userId: String(existingUser._id),
                name: existingUser.name,
                email: existingUser.email,
            },
        });
    } catch (err) {
        console.error("Error during OTP verification:", err.message);
        next(err);
    }
}

module.exports = {
    signIn,
    verifyOTP,
    signUp,
};
