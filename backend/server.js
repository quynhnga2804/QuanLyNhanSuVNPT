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
const path = require("path");

app.use(helmet({crossOriginResourcePolicy: false}));

// Middleware
app.use(express.json());

app.use(cors());

// Giới hạn số lần đăng nhập thất bại
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn mỗi IP chỉ được 5 lần thử đăng nhập trong 15 phút
  message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút'
});

app.use('/api/auth/login', loginLimiter);

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
  res.status(404).json({ message: "Không tìm thấy trang!" });
});

// Xử lý lỗi 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Lỗi server!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});