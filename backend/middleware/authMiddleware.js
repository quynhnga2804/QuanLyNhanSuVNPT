const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Truy cập bị từ chối! Không có token.' });
    }
    
    jwt.verify(token.replace('Bearer ', ''), SECRET_KEY, (err, user) => {
        if (err) {
            console.error("Lỗi xác thực token:", err);
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        req.user = user; // Gán thông tin user vào req để sử dụng trong các API khác
        next();
    });
}

module.exports = authenticateToken;