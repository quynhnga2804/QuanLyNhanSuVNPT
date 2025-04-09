# backend
node server.js

# frontend
npm run dev

- Dùng cổng 587 để không bị chặn gửi (nếu bị chặn cổng: 465)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  // 👈 thay vì `service: "gmail"`
    port: 587,                // 👈 TLS
    secure: false,            // 👈 phải là false nếu dùng 587
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
