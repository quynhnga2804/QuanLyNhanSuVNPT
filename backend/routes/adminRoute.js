const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');

// Kiểm tra xem controller có tồn tại không
if (!adminController.getAll) {
    console.error("Lỗi: adminController.getAll bị undefined! Kiểm tra lại adminController.js");
    throw new Error("Lỗi: adminController.getAll bị undefined! Kiểm tra lại adminController.js");
}

// Routes
router.get('/:model', authenticateToken, adminController.getAll);
router.get('/:model/search', authenticateToken, adminController.search);
router.get('/:model/:id', authenticateToken, adminController.getById);
router.post('/:model', authenticateToken, adminController.createModelWithImage);
router.put('/:model/:id', authenticateToken, adminController.updateModelWithImage);
router.delete('/:model/:id', authenticateToken, adminController.remove);
// Thao tác với tài khoản
router.post("/users/create", authenticateToken, adminController.createUser);
router.delete("/users/delete/:email", authenticateToken, adminController.deleteUser);

module.exports = router;