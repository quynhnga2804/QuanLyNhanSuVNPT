const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');


// Lấy thông tin nhân viên
router.get('/employeeinfo', authenticateToken, userController.getEmployeeInfo);
router.get('/jobinfo', authenticateToken, userController.getJobProfile);
router.get('/personalinfo', authenticateToken, userController.getPersonalProfile);
router.get('/familymembers', authenticateToken, userController.getFamilyMember);

// Gửi OTP để đổi mật khẩu
router.post('/send-otp', authenticateToken, userController.sendOTP);

// Đổi mật khẩu
router.post('/change-password', authenticateToken, userController.ChangePassword);
module.exports = router;
