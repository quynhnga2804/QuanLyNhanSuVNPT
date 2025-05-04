const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models/indexModel');
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoute');
const authenticateToken = require('./middleware/authMiddleware');
const app = express();
const path = require('path');
const { login } = require('./controllers/authController');
const cron = require('node-cron');
const Contract = require('./models/employeecontractModel');
const Employee = require('./models/employeeModel');
const Notification = require('./models/notificationModel');

app.use(helmet({crossOriginResourcePolicy: false}));

// Middleware
app.use(express.json());

app.use(cors());

// Giới hạn số lần đăng nhập thất bại
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút!' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', loginLimiter, login);

sequelize.sync({ force: false }) // false sẽ giữ nguyên dữ liệu và tạo bảng nếu chưa tồn tại
  .then(() => {
    console.log('Database is connected');
  })
  .catch(err => {
    console.log('Lỗi đồng bộ hóa cơ sở dữ liệu: ', err);
  });

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authenticateToken);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy trang!' });
});

// Xử lý lỗi 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Lỗi server!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//thông báo tự động
cron.schedule('0 0 * * *', async () => {
  console.log("Cron đang chạy...");
  const today = new Date();

  const contracts = await Contract.findAll();

  for (const contract of contracts) {
    const endDate = new Date(contract.EndDate);

    // Tính số ngày còn lại
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((endDate - today) / msPerDay);

    if (daysLeft === 30) {
      const sendID = `HD${contract.employcontractID}`;

      const existingNotification = await Notification.findOne({ where: { sentID: sendID } });
      if (!existingNotification) {
        const user = await Employee.findByPk(contract.EmployeeID);
        console.log("user: ", user);
        console.log("sendID: ", sendID);
        console.log("sendID: ", sendID);
        if (user) {
          await Notification.create({
            sentID: sendID,
            receivedID: user.EmployeeID,
            Title: 'Thông báo hợp đồng',
            Type: 'Nhắc nhở',
            Message: `Hợp đồng ${sendID} của bạn sẽ hết hạn sau 30 ngày.`,
            CreatedAt: new Date(),
            ExpiredAt: endDate
          });
          console.log("Bạn đã gửi thông báo thành công!");
        }
        console.log("Đã đến đây!");
      }
    }
  }
});