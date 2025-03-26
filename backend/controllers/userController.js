const Employee = require("../models/employeeModel");
const JobProfile = require("../models/jobProfileModel");
const PersonalProfile = require("../models/personalProfileModel");
const FamilyMember = require("../models/familyMemberModel");
const Department = require('../models/departmentModel');
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { hash, verify } = require("../utils/passwordUtils");
require("dotenv").config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Lưu OTP tạm thời
const otpStorage = {};

// Hàm tìm EmployeeID theo email và kiểm tra quyền truy cập
const getEmployeeIDByEmail = async (email, role) => {
    if (role !== 'User') {
        throw new Error("Bạn không có quyền truy cập!");
    }

    console.log(`🔍 Tìm EmployeeID với email: ${email}`);
    const employee = await Employee.findOne({
        where: { WorkEmail: email },
        attributes: ["EmployeeID"] // Chỉ lấy EmployeeID để tối ưu truy vấn
    });

    if (!employee) {
        console.error("❌ Không tìm thấy tài khoản với email này!");
        throw new Error("Không tìm thấy tài khoản");
    }

    console.log(`✅ Tìm thấy EmployeeID: ${employee.EmployeeID}`);
    return employee.EmployeeID;
};

// Lấy thông tin nhân viên
exports.getEmployeeInfo = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);

        console.log(`🔍 Lấy thông tin nhân viên với ID: ${employeeID}`);
        // const employeeInfo = await Employee.findOne({ where: { EmployeeID: employeeID } });
        const employeeInfo = await Employee.findOne({
            where: { EmployeeID: employeeID },
            include: {
                model: Department, // Liên kết với bảng Department
                attributes: ['DepartmentName'] // Chỉ lấy DepartmentName
            }
        });

        if (!employeeInfo) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }
        res.json(employeeInfo);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ 
            message: error.message 
        });
    }
};

// Lấy thông tin công việc (JobProfile)
exports.getJobProfile = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);

        console.log(`🔍 Lấy thông tin công việc với ID: ${employeeID}`);
        const jobProfile = await JobProfile.findOne({ where: { EmployeeID: employeeID } });

        if (!jobProfile) {
            return res.status(404).json({ message: "Không tìm thấy thông tin công việc" });
        }
        res.json(jobProfile);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ 
            message: error.message 
        });
    }
};

// Lấy thông tin cá nhân (PersonalProfile)
exports.getPersonalProfile = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const personalProfile = await PersonalProfile.findOne({ where: { EmployeeID: employeeID } });

        if (!personalProfile) {
            return res.status(404).json({ message: "Không tìm thấy thông tin cá nhân" });
        }
        res.json(personalProfile);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ 
            message: error.message 
        });
    }
};

// Lấy thông tin người thân (FamilyMember)
exports.getFamilyMember = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);

        console.log(`🔍 Lấy thông tin người thân với ID: ${employeeID}`);
        const familyMembers = await FamilyMember.findAll({ where: { EmployeeID: employeeID } });

        if (!familyMembers || familyMembers.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin người thân" });
        }
        res.json(familyMembers);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ 
            message: error.message 
        });
    }
};


// Gửi OTP
// Gửi OTP (Chỉ gửi khi mật khẩu hợp lệ)
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.user;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Lấy user theo email
        const user = await User.findOne({ where: { WorkEmail: email } });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
        }

        // Kiểm tra mật khẩu cũ có đúng không
        const isMatch = await verify(user.Password, oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
        }

        // Kiểm tra mật khẩu mới và nhập lại mật khẩu có khớp không
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu mới không khớp!" });
        }

        // Nếu tất cả đều hợp lệ, tạo OTP và gửi email
        const otp = generateOTP();
        otpStorage[email] = { otp, expiresAt: Date.now() + 60000 };

        const mailOptions = {
            from: `"VNPT Nghệ An" <${EMAIL_USER}>`,
            to: email,
            subject: "Mã OTP đổi mật khẩu",
            text: `Mã OTP đổi mật khẩu của bạn là: ${otp}. Mã này có hiệu lực trong 1 phút.`,
        };
        await transporter.sendMail(mailOptions);
        
        res.json({ message: "OTP đã được gửi! Hãy kiểm tra email của bạn!" });
    } catch (error) {
        res.status(500).json({ message: "Không thể gửi OTP!", error: error.message });
    }
};


// Đổi mật khẩu
exports.ChangePassword = async (req, res) => {
    try {
        console.log(`🔒 Yêu cầu đổi mật khẩu từ ${req.user.email}`);
        const { email } = req.user;
        const { newPassword, otp } = req.body;

        // Kiểm tra OTP
        if (!otpStorage[email] || otpStorage[email].otp !== otp || Date.now() > otpStorage[email].expiresAt) {
            return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
        }

        delete otpStorage[email]; // Xóa OTP sau khi sử dụng

        // Mã hóa mật khẩu mới
        const hashedPassword = await hash(newPassword);
        
        // Cập nhật mật khẩu trong database
        await User.update({ Password: hashedPassword }, { where: { WorkEmail: email } });

        console.log("✅ Mật khẩu đã được thay đổi thành công");
        res.json({ message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
