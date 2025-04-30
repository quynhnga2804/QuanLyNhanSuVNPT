const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');


// Lấy thông tin nhân viên
router.get('/employeeinfo', authenticateToken, userController.getEmployeeInfo);
router.get('/jobinfo', authenticateToken, userController.getJobProfile);
router.get('/personalinfo', authenticateToken, userController.getPersonalProfile);
router.get('/familymembers', authenticateToken, userController.getFamilyMember);
router.get('/contractinfo', authenticateToken, userController.getContractUser);
router.get('/attendances', authenticateToken, userController.getAttendancesUser);
router.get('/overtimes', authenticateToken, userController.getOverTimeUser);
router.get('/leaves', authenticateToken, userController.getLeaveInfoUser);
router.get('/monthlysalaries', authenticateToken, userController.getMonthlySalaryUser);
// Lấy danh sách thông báo
router.get('/notifications', authenticateToken, userController.getNotifications);

// Đánh dấu thông báo đã đọc
router.put('/notifications/:id/read', authenticateToken, userController.markNotificationAsRead);

// Xóa thông báo
router.delete('/notifications/:id', authenticateToken, userController.deleteNotification);

router.post('/send-otp', authenticateToken, userController.sendOTP);
router.post('/change-password', authenticateToken, userController.ChangePassword);

// Lấy kỳ lương gần nhất
router.get('/latest-payrollcycle', authenticateToken, userController.getLatestPayrollCycle);
// lấy manager theo phòng ban của nhân viên
router.get('/get-managers', authenticateToken, userController.getUserManager);
// request tăng ca
router.post('/req-overtime', authenticateToken, userController.addOvertimeEmployeeRe);
router.post('/leave-req', authenticateToken, userController.addLeaveRequest);
router.post('/req-resign', authenticateToken, userController.addResignation);
router.post('/checkin', authenticateToken, userController.postCheckin);
router.put('/checkout', authenticateToken, userController.putCheckout);
router.get('/notify-expiring-contracts', authenticateToken, userController.notifyExpiringContracts);
module.exports = router;
