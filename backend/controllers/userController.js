const Employee = require("../models/employeeModel");
const JobProfile = require("../models/jobProfileModel");
const PersonalProfile = require("../models/personalProfileModel");
const FamilyMember = require("../models/familyMemberModel");
const Department = require('../models/departmentModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const UserNotification = require('../models/userNotificationModel');
const LaborContract = require('../models/laborcontractModel');
const EmployeeContract = require('../models/employeecontractModel');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { hash, verify } = require("../utils/passwordUtils");
const Attendance = require("../models/attendanceModel");
const PayrollCycle = require("../models/payrollCycleModel");
const { OverTime } = require("../models/indexModel");
const MonthlySalary = require("../models/monthlysalaryModel");
const Resignation = require("../models/resignationModel");
const Division = require("../models/divisionModel");
const LeaveRquest = require("../models/leaverequestModel");
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
    const employee = await Employee.findOne({
        where: { WorkEmail: email },
        attributes: ["EmployeeID"]
    });
    if (!employee) {
        throw new Error("Không tìm thấy tài khoản");
    }
    return employee.EmployeeID;
};

// Lấy thông tin nhân viên
exports.getEmployeeInfo = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const employeeInfo = await Employee.findOne({
            where: { EmployeeID: employeeID },
            include: {
                model: Department, 
                attributes: ['DepartmentName'],
                include: {
                    model: Division,
                    attributes: ['DivisionsName']
                }
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

//Lấy thông tin hợp đồng
exports.getContractUser = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const contractUser = await EmployeeContract.findAll({
            where: { EmployeeID: employeeID },
            order: [['StartDate', 'DESC']],
            include: {
                model: LaborContract,
                attributes: ['ContractType']
            }
        });
        if (!contractUser) {
            return res.status(400).json({ message: "Không tìm thấy hợp đồng của nhân viên! "});
        }
        res.json(contractUser);
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
        
        const jobProfile = await JobProfile.findOne({ where: { EmployeeID: employeeID } });
        // const resignation = await Resignation.findOne({ where: { EmployeeID: employeeID, Status: 'Approved'}});
        const resignation = await Resignation.findOne({ where: { EmployeeID: employeeID}});

        if (!jobProfile) {
            return res.status(404).json({ message: "Không tìm thấy thông tin công việc" });
        }
        res.json({jobProfile, resignation: resignation || null }); 
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
            return res.status(404).json({ message: "Không tìm thấy thông tin cá nhân!" });
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

// Gửi OTP (Chỉ gửi khi mật khẩu hợp lệ)
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.user;
        const { oldPassword } = req.body;

        const user = await User.findOne({ where: { WorkEmail: email } });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
        }
        const isMatch = await verify(user.Password, oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
        }
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
        const { email } = req.user;
        const { newPassword, otp } = req.body;
        if (!otpStorage[email] || otpStorage[email].otp !== otp || Date.now() > otpStorage[email].expiresAt) {
            return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
        }

        delete otpStorage[email]; // Xóa OTP sau khi sử dụng

        const hashedPassword = await hash(newPassword);
        await User.update({ Password: hashedPassword }, { where: { WorkEmail: email } });
        res.json({ message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API đánh dấu thông báo đã đọc
exports.markNotificationAsRead = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const { id } = req.params;

        await UserNotification.upsert({ EmployeeID: employeeID, NotificationID: id, IsRead: true });

        res.json({ message: "Thông báo đã được đánh dấu là đã đọc." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API xóa thông báo
exports.deleteNotification = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const { id } = req.params;
        const existingRecord = await UserNotification.findOne({ where: { EmployeeID: employeeID, NotificationID: id } });
        if (existingRecord) {
            await existingRecord.update({ IsDeleted: true });
        } else {
            await UserNotification.create({ EmployeeID: employeeID, NotificationID: id, IsDeleted: true });
        }

        res.json({ message: "Thông báo đã được xóa." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông báo
exports.getNotifications = async (req, res) => {
    try {
        const { email, role } = req.user;
        const onlyUnread = req.query.onlyUnread === "true";  // Lấy tham số từ query
        const employeeID = await getEmployeeIDByEmail(email, role);

        // Lấy thông báo riêng và chung
        const privateNotifications = await Notification.findAll({
            where: { receivedID: employeeID },
            order: [['CreatedAt', 'DESC']]
        });
        const publicNotifications = await Notification.findAll({
            where: { receivedID: 'All' },
            order: [['CreatedAt', 'DESC']]
        });
        // Kết hợp
        const allNotifications = [...privateNotifications, ...publicNotifications];
        // Kiểm tra trạng thái IsDeleted và IsRead
        const filteredNotifications = await Promise.all(
            allNotifications.map(async (notification) => {
                const userNotification = await UserNotification.findOne({
                    where: {
                        EmployeeID: employeeID,
                        NotificationID: notification.NotificationID,
                    },
                });

                if (userNotification && userNotification.IsDeleted) {
                    return null; // Bỏ qua nếu đã xóa
                }
                return {
                    ...notification.toJSON(),
                    IsRead: userNotification ? userNotification.IsRead : false,
                };
            })
        );

        // Lọc bỏ null
        let finalList = filteredNotifications.filter((item) => item !== null);

        // Nếu client yêu cầu chỉ lấy chưa đọc thì lọc tiếp:
        if (onlyUnread) {
            finalList = finalList.filter((n) => !n.IsRead);
        }

        const unreadCount = finalList.filter((n) => !n.IsRead).length;

        // Trả về client
        res.json({
            notifications: finalList,
            unreadCount: unreadCount,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chấm công nhân viên
exports.getAttendancesUser = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);

        const attendancesUser = await Attendance.findAll({
            where: { EmployeeID : employeeID},
            include: [
                {
                    model: Employee, attributes: ['FullName'] 
                },
            ]
        });
        if (!attendancesUser){
            return res.status(404).json({ message: "Không tìm thấy chấm công nhân viên!"});
        } 
        res.json(attendancesUser);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({message: error.message});
    }
};

// Kiểm tra checkin và update tg check in
exports.postCheckin = async(req, res) => {
    try {
        const { email, role } = req.user;
        const { checkInLocation, AttendancesDate, CheckInTime } = req.body;
        const employeeID = await getEmployeeIDByEmail(email, role);

        const newCheckIn = await Attendance.create({
            EmployeeID: employeeID, AttendancesDate: AttendancesDate, CheckInTime: CheckInTime, CheckInLocation: checkInLocation
        });
        res.status(201).json({ message: "Check-in thành công!", data: newCheckIn });
    } catch (error) {
        console.error("Lỗi khi Check-in:", error);
        res.status(500).json({ message: "Lỗi server khi Check-in!" });
    }
};

//Checkout
exports.putCheckout = async (req, res) => {
    try {
        const { email, role } = req.user;
        const { today, checkOutLocation, TotalHoursWorked, CheckOutTime } = req.body;
        const employeeID = await getEmployeeIDByEmail(email, role);

        const existingCheckout = await Attendance.findOne({
            where: { EmployeeID: employeeID, AttendancesDate: today }
        });

        await existingCheckout.update({
            CheckOutTime: CheckOutTime,
            CheckOutLocation: checkOutLocation,
            TotalHoursWorked: TotalHoursWorked.toFixed(2)  // Giữ 2 chữ số thập phân
        });

        res.status(201).json({ message: 'Check-out thành công!', TotalHoursWorked: TotalHoursWorked.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi check-out!' });
    }
};

// Lấy thông tin overtime 
exports.getOverTimeUser = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const overtimeUser = await OverTime.findAll({
            where: { EmployeeID: employeeID },
            include: [
                { model: Employee, attributes: ['FullName'] },
                { model: PayrollCycle, attributes: ['PayrollName'] }
            ]
        });
        if (!overtimeUser || overtimeUser.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin tăng ca!" });
        }
        res.json(overtimeUser);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ message: error.message });
    }
};

// Lấy thông tin overtime 
exports.getOverTimeUser = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const overtimeUser = await OverTime.findAll({
            where: { EmployeeID: employeeID },
            include: [
                { model: Employee, attributes: ['FullName'] },
                { model: PayrollCycle, attributes: ['PayrollName'] }
            ]
        });
        if (!overtimeUser || overtimeUser.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin nggir phép!" });
        }
        res.json(overtimeUser);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ message: error.message });
    }
};

// Lấy thông tin nghỉ phép 
exports.getLeaveInfoUser = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const leaveInfo = await LeaveRquest.findAll({
            where: { EmployeeID: employeeID },
            include: [
                { model: Employee, attributes: ['FullName'] }
            ]
        });
        if (!leaveInfo || leaveInfo.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin nghỉ phép!" });
        }
        res.json(leaveInfo);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ message: error.message });
    }
};

//request tăng ca
exports.addOvertimeEmployeeRe = async (req, res) => {
    try {
        const { EmployeeID, ManagerID, ReasonOT, OTType, DateTime, OverTimesHours, Status, ID_PayrollCycle, CreatedAt } = req.body;
        await OverTime.create({
            EmployeeID,
            ManagerID,
            ReasonOT,
            OTType,
            DateTime,
            OverTimesHours,
            Status,
            ID_PayrollCycle, 
            CreatedAt 
        });

        res.json({ message: 'Tạo thông tin tăng ca thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lưu tăng ca!' });
    }
};
exports.addLeaveRequest = async (req, res) => {
    try {
        const { EmployeeID, ManagerID, LeaveReason, StartDate, EndDate, Status, CreatedAt } = req.body;
        await LeaveRquest.create({
            EmployeeID,
            ManagerID,
            LeaveReason,
            StartDate, 
            EndDate,
            Status,
            CreatedAt 
        });

        res.json({ message: 'Tạo thông tin nghỉ phép thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lưu tăng nghỉ phép!' });
    }
};

//lấy kỳ lương gần nhất
exports.getLatestPayrollCycle = async (req, res) => {
    try {
        const latestPayroll = await PayrollCycle.findOne({
            where: { Status: 'Chưa bắt đầu'},
        });
        
        if (!latestPayroll) {
            return res.status(404).json({ message: "Không tìm thấy kỳ lương hiện tại! "});
        }
        return res.status(200).json(latestPayroll);
    }  catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

exports.getUserManager = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const employee = await Employee.findOne({
            where: { EmployeeID: employeeID },
            attributes: ['DepartmentID'],
        });
        
        const department = await Department.findOne({
            where: { DepartmentID: employee.DepartmentID },
            attributes: ['DivisionID']
        });
        
        const divisionID = department.DivisionID;
        const managers = await Employee.findAll({
            include: [{
                model: Department,
                where: { DivisionID: divisionID },
            }],
            where: { Position: 'Quản lý' }
        });      
        return res.status(200).json(managers);
    }  catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
};

//Lấy thông tin lương nhân viên
exports.getMonthlySalaryUser = async (req, res) => {
    try {
        const { email, role } = req.user;
        const employeeID = await getEmployeeIDByEmail(email, role);
        const jobProfile = await JobProfile.findOne({ where: { EmployeeID: employeeID } });

        const monthlySalaryUser = await MonthlySalary.findAll({
            where: { EmployeeID: employeeID },
            order: [['PaymentDate', 'ASC']],
            include: [
                { model: Employee, attributes: ['FullName'] },
                { model: PayrollCycle, attributes: ['PayrollName'] }
            ]
        });

        if (!monthlySalaryUser || monthlySalaryUser.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin lương tháng!" });
        }

        const monthlySalaryWithJobProfile = monthlySalaryUser.map(item => ({
            ...item.toJSON(),  // chuyển về object trước khi spread
            BaseSalary: jobProfile ? jobProfile.BaseSalary : 0,
            Allowance: jobProfile ? jobProfile.Allowance : 0,
        }));

        res.json(monthlySalaryWithJobProfile);
    } catch (error) {
        res.status(error.message === "Bạn không có quyền truy cập!" ? 403 : 500).json({ message: error.message });
    }
};


// yêu cầu nghỉ việc
exports.addResignation = async (req, res) => {
    try {
        const {EmployeeID, ManagerID, Reason, ResignationsDate, Status, CreatedAt} = req.body;
        await Resignation.create({ 
            EmployeeID, ManagerID, Reason, ResignationsDate, Status, CreatedAt
        });
        res.json({ message: 'Tạo yêu cầu nghỉ việc thành công!' });
    } catch (error) {
        console.error("❌ Lỗi khi tạo resign:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lưu yêu cầu nghỉ việc!' });
    }
};