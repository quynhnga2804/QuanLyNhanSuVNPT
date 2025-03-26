const argon2 = require('argon2');

async function hash(password) {
    try {
        return await argon2.hash(password);
    } catch (error) {
        console.error('Lỗi khi băm mật khẩu:', error);
        throw error; // Rethrow để xử lý lỗi ở nơi gọi hàm
    }
}

async function verify(hashedPassword, password) {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (error) {
        console.error('Lỗi khi xác minh mật khẩu:', error);
        return false;
    }
}

module.exports = { hash, verify };
