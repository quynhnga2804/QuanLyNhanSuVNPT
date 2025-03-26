import React from "react";
import { Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

const HRPolicy = () => {
  return (
    <div style={{ overflowX: 'auto', width: '100%', padding: '20px 40px', height: '90vh' }}>
      <Typography>
        <Title level={4}>📌 CHÍNH SÁCH NHÂN SỰ</Title>
        <Title level={4}>🔹 1. Tuyển dụng và thử việc</Title>
        <Paragraph>
          <ul>
            <li><Text strong>Quy trình tuyển dụng:</Text> Bao gồm sàng lọc hồ sơ, phỏng vấn, đánh giá năng lực.</li>
            <li><Text strong>Thời gian thử việc:</Text> Tối đa 02 tháng, hưởng ít nhất 85% lương chính thức.</li>
            <li><Text strong>Chính sách tiếp nhận:</Text> Ký hợp đồng chính thức sau khi hoàn thành thử việc đạt yêu cầu.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 2. Chính sách lương & phúc lợi</Title>
        <Paragraph>
          <ul>
            <li><Text strong>Hệ thống lương:</Text> Căn cứ vào vị trí, năng lực và hiệu suất làm việc.</li>
            <li><Text strong>Phúc lợi:</Text> Bảo hiểm, trợ cấp ăn trưa, đi lại, nhà ở, thưởng hiệu suất.</li>
            <li><Text strong>Thưởng cuối năm:</Text> Xét theo kết quả kinh doanh và đóng góp cá nhân.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 3. Đào tạo & Phát triển</Title>
        <Paragraph>
          <ul>
            <li>Công ty tổ chức <Text strong>các khóa đào tạo nội bộ</Text> để nâng cao kỹ năng chuyên môn.</li>
            <li>Nhân viên có thể tham gia <Text strong>các khóa học bên ngoài</Text> với hỗ trợ tài chính từ công ty.</li>
            <li>Cơ hội thăng tiến dựa trên hiệu suất làm việc và đánh giá năng lực hàng năm.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 4. Chế độ làm việc</Title>
        <Paragraph>
          <ul>
            <li><Text strong>Thời gian làm việc:</Text> 08:00 - 17:00 từ thứ Hai đến thứ Sáu.</li>
            <li><Text strong>Chính sách làm thêm giờ (OT):</Text> Hỗ trợ OT theo quy định công ty.</li>
            <li><Text strong>Nghỉ phép:</Text> 12 ngày phép/năm, nghỉ lễ theo quy định nhà nước.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 5. Kỷ luật và đạo đức công việc</Title>
        <Paragraph>
          <ul>
            <li>Nhân viên phải <Text strong>tuân thủ quy tắc ứng xử</Text> và nội quy công ty.</li>
            <li>Các hành vi vi phạm như <Text strong>gian lận, quấy rối, vi phạm bảo mật</Text> có thể bị kỷ luật nghiêm khắc.</li>
            <li>Quy trình khiếu nại, phản hồi đảm bảo quyền lợi của nhân viên.</li>
          </ul>
        </Paragraph>
      </Typography>
    </div>
  );
};

export default HRPolicy;
