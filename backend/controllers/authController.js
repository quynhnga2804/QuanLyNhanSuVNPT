const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const { verify } = require("../utils/passwordUtils");
require("dotenv").config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

const otpStore = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    try {
        const user = await User.findOne({ where: { WorkEmail: email } });
        if (!user) return res.status(401).json({ message: "Sai email hoặc mật khẩu!" });

        const isMatch = await verify(user.Password, password);
        if (!isMatch) return res.status(401).json({ message: "Mật khẩu không đúng!" });

        // Tạo mã 2FA nếu chưa có
        if (!user.twoFactorSecret) {
            const secret = speakeasy.generateSecret();
            user.twoFactorSecret = secret.base32;
            await user.save();
        }

        const token = jwt.sign({ email: user.WorkEmail, name: user.UserName, role: user.Role, lastPasswordChange: user.LastPasswordChange }, SECRET_KEY, { expiresIn: "5m" });
        res.json({ token, user: { email: user.WorkEmail, name: user.UserName, role: user.Role, lastPasswordChange: user.LastPasswordChange } });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.sendOTP = async (req, res) => {
    const { email, tokenA } = req.body;
    if (!email || !tokenA) return res.status(400).json({ message: "Email và Token là bắt buộc!" });

    try {
        const decoded = jwt.verify(tokenA, SECRET_KEY); // Kiểm tra token hợp lệ
        const { email, name, role, lastPasswordChange } = decoded;

        const otp = generateOTP();
        otpStore[email] = otp; // Lưu OTP tạm thời
        const token = jwt.sign({ email, name, role, lastPasswordChange, otp }, SECRET_KEY, { expiresIn: "1m" });

        const mailOptions = {
            from: `"VNPT Nghệ An" <${EMAIL_USER}>`,
            to: email,
            subject: "Mã OTP đăng nhập",
            text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 1 phút.`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP đã được gửi! Hãy kiểm tra email của bạn!", token });
    } catch (error) {
        console.error("Lỗi gửi OTP:", error);
        res.status(500).json({ message: "Không thể gửi OTP!", error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { token, otp } = req.body;
    if (!token || !otp) return res.status(400).json({ message: "Token và OTP là bắt buộc!" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const { email, name, role, lastPasswordChange } = decoded;

        if (otpStore[email] !== otp) {
            return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn!" });
        }

        delete otpStore[email];

        const tokenB = jwt.sign({ email, name, role, lastPasswordChange }, SECRET_KEY, { expiresIn: "10h" });

        res.json({ message: "Xác thực thành công!", token: tokenB});
    } catch (error) {
        console.error("Lỗi xác thực OTP:", error);
        res.status(400).json({ message: "OTP hết hạn hoặc không hợp lệ!" });
    }
};

exports.verifyTwoFactor = async (req, res) => {
    const { email, token } = req.body;

    try {
        const user = await User.findOne({ where: { WorkEmail: email } });

        if (!user) {
            return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token
        });

        if (!verified) {
            return res.status(401).json({ message: "Mã xác thực không hợp lệ" });
        }

        res.json({ message: "Xác thực 2FA thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
