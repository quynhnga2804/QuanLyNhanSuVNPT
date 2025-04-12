const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const speakeasy = require('speakeasy');
const Department = require('../models/departmentModel');
const Division = require('../models/divisionModel');
const Employee = require('../models/employeeModel');
const User = require('../models/userModel');
const EmployeeContract = require('../models/employeecontractModel');
const { hash } = require("../utils/passwordUtils");
const MonthlySalary = require('../models/monthlysalaryModel');
const PayrollCycle = require('../models/payrollCycleModel');
const JobProfile = require('../models/jobProfileModel');
const LaborContract = require('../models/laborcontractModel');
const Overtime = require('../models/overtimeModel');
const FamilyMember = require('../models/familyMemberModel');
const Attendance = require('../models/attendanceModel');
const Notification = require('../models/notificationModel');
const UserNotification = require('../models/userNotificationModel');
const Resignation = require('../models/resignationModel');
const PersonalProfile = require('../models/personalProfileModel');
const IncomeTax = require('../models/incometaxModel');
const Insurance = require('../models/insuranceModel');

const modelMap = {
  attendance: Attendance,
  attendances: Attendance,
  department: Department,
  departments: Department,
  division: Division,
  divisions: Division,
  employee: Employee,
  employees: Employee,
  employeecontract: EmployeeContract,
  employeecontracts: EmployeeContract,
  familymember: FamilyMember,
  familymembers: FamilyMember,
  jobprofile: JobProfile,
  jobprofiles: JobProfile,
  incometax: IncomeTax,
  incometaxes: IncomeTax,
  insurance: Insurance,
  insurances: Insurance,
  laborcontract: LaborContract,
  laborcontracts: LaborContract,
  monthlysalary: MonthlySalary,
  monthlysalaries: MonthlySalary,
  notification: Notification,
  notifications: Notification,
  overtime: Overtime,
  overtimes: Overtime,
  payrollcycle: PayrollCycle,
  payrollcycles: PayrollCycle,
  personalprofile: PersonalProfile,
  personalprofiles: PersonalProfile,
  resignation: Resignation,
  resignations: Resignation,
  user: User,
  users: User,
  usernotification: UserNotification,
  usernotifications: UserNotification,
  personalprofile : PersonalProfile,
  personalprofiles : PersonalProfile,
  resignation : Resignation,
  resignations : Resignation,
};

// Cấu hình lưu ảnh vào thư mục uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Lấy tất cả bản ghi
const getAll = async (req, res) => {
  try {
    if (!['Admin', 'Director', 'Manager', 'Accountant'].includes(req.user.role))
      return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });

    const Model = modelMap[req.params.model];
    if (!Model) return res.status(400).json({ message: `Model '${req.params.model}' không hợp lệ` });

    const records = await Model.findAll();
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error });
  }
};

// Lấy một bản ghi theo ID
const getById = async (req, res) => {
  try {
    const Model = modelMap[req.params.model];
    if (!Model) return res.status(400).json({ message: `Model '${req.params.model}' không hợp lệ` });

    const record = await Model.findByPk(req.params.id);
    record ? res.json(record) : res.status(404).json({ message: 'Không tìm thấy' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm mới
const create = async (req, res) => {
  try {
    if (!['Admin', 'Director', 'Manager', 'Accountant'].includes(req.user.role))
      throw new Error("Bạn không có quyền truy cập!");

    const Model = modelMap[req.params.model];
    if (!Model) return res.status(400).json({ message: `Model '${req.params.model}' không hợp lệ` });

    let newData = req.body;

    // Nếu có file ảnh, thêm tên file vào dữ liệu
    if (req.file) {
      newData.Image = req.file.filename;
    }

    // Tạo bản ghi mới
    const newRecord = await Model.create(newData);

    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi tạo mới' });
  }
};

// Thêm mới tài khoản người dùng
const createUser = async (req, res) => {
  try {
    if (!['Admin', 'Director'].includes(req.user.role))
      throw new Error("Bạn không có quyền truy cập!");

    const { WorkEmail, UserName, Password, Role } = req.body;
    if (!WorkEmail || !UserName || !Password || !Role) {
      return res.status(400).json({ message: "Thiếu thông tin tài khoản!" });
    }

    const existingUser = await User.findOne({ where: { WorkEmail } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const hashedPassword = await hash(Password);

    // Tạo secret key cho 2FA
    const twoFactorSecret = speakeasy.generateSecret().base32;

    // Lưu vào database
    const newUser = await User.create({
      WorkEmail,
      UserName,
      Password: hashedPassword,
      Role,
      twoFactorSecret,
    });

    res.status(201).json({
      message: "Tài khoản được tạo thành công!",
      user: {
        WorkEmail: newUser.WorkEmail,
        UserName: newUser.UserName,
        Role: newUser.Role,
        twoFactorSecret,
      },
    });
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa tài khoản người dùng
const deleteUser = async (req, res) => {
  try {
    if (!['Admin', 'Director'].includes(req.user.role))
      throw new Error("Bạn không có quyền truy cập!");

    const { email } = req.params;
    const user = await User.findOne({ where: { WorkEmail: email } });

    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    // Xóa user
    await user.destroy();

    res.status(200).json({ message: "Tài khoản đã bị xóa!" });
  } catch (error) {
    console.error("Lỗi xóa tài khoản:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// Cập nhật
const update = async (req, res) => {
  try {
    const Model = modelMap[req.params.model];
    if (!Model) return res.status(400).json({ message: `Model '${req.params.model}' không hợp lệ` });

    const primaryKey = Model.primaryKeyAttributes[0];
    const condition = { [primaryKey]: req.params.id };

    let updateData = req.body;

    if (req.file) {
      const employee = await Model.findByPk(req.params.id);
      if (employee && employee.Image) {
        const oldImagePath = path.join(__dirname, '../uploads', employee.Image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.Image = req.file.filename;
    }

    const [updated] = await Model.update(updateData, { where: condition });

    if (updated) {
      res.json(await Model.findByPk(req.params.id));
    } else {
      res.status(404).json({ message: 'Không tìm thấy dữ liệu để cập nhật' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa
const remove = async (req, res) => {
  try {
    const Model = modelMap[req.params.model];
    if (!Model) return res.status(400).json({ message: `Model '${req.params.model}' không hợp lệ` });

    const primaryKey = Model.primaryKeyAttributes[0];
    const condition = { [primaryKey]: req.params.id };

    const employee = await Model.findOne({ where: condition });
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân sự' });
    }

    // Nếu nhân sự có ảnh, xóa ảnh trong thư mục `uploads`
    if (employee.Image) {
      const imagePath = path.join(__dirname, '../uploads', employee.Image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Model.destroy({ where: condition });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tìm kiếm
const search = async (req, res) => {
  try {
    const query = req.query.q;
    const Model = modelMap[req.params.model];
    if (!Model) return res.status(400).json({ message: `Model '${req.params.model}' không hợp lệ` });

    const stringFields = Object.keys(Model.rawAttributes).filter(
      key => ['STRING', 'TEXT'].includes(Model.rawAttributes[key].type.key)
    );

    const searchFields = stringFields.map(key => ({
      [key]: { [Op.like]: `%${query}%` },
    }));

    const records = await Model.findAll({ where: { [Op.or]: searchFields } });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createModelWithImage = [upload.single('Image'), create];
const updateModelWithImage = [upload.single('Image'), update];
module.exports = { getAll, getById, remove, search, createModelWithImage, updateModelWithImage, createUser, deleteUser };
