import React from "react";
import { Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

const WorkRegulations = () => {
  return (
    <div style={{ overflowX: 'auto', width: '100%', padding: '20px 40px', height: '90vh' }}>
      <Typography>
        <Title level={4}>📌 QUY ĐỊNH LÀM VIỆC</Title>
        <Title level={4}>🔹 1. Thời gian làm việc</Title>
        <Paragraph>
          <Text strong>✅ Giờ hành chính:</Text> Thứ Hai - Thứ Sáu, 08:00 - 17:00 (nghỉ trưa 12:00 - 13:00).  
          <br />
          <Text strong>✅ Ca làm việc linh hoạt:</Text> Đối với nhân viên làm theo ca hoặc part-time, thời gian làm việc cụ thể sẽ được thông báo trước.
        </Paragraph>

        <Title level={4}>🔹 2. Quy định chấm công</Title>
        <Paragraph>
          <ul>
            <li>Nhân viên cần <Text strong>chấm công</Text> đúng giờ trên hệ thống chấm công.</li>
            <li>Đi trễ trên 15 phút sẽ bị ghi nhận và có thể bị trừ lương.</li>
            <li>Vắng mặt không có lý do hợp lệ sẽ bị xử lý theo quy định.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 3. Nội quy nơi làm việc</Title>
        <Paragraph>
          <ul>
            <li><Text strong>Trang phục:</Text> Lịch sự, chuyên nghiệp theo quy định công ty.</li>
            <li><Text strong>Không sử dụng điện thoại cá nhân</Text> trong giờ làm việc trừ khi cần thiết.</li>
            <li><Text strong>Giữ gìn tài sản công ty</Text>, không sử dụng tài sản công vào mục đích cá nhân.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 4. Chính sách làm thêm giờ (OT)</Title>
        <Paragraph>
          <ul>
            <li>OT chỉ được tính khi có sự phê duyệt của quản lý.</li>
            <li>Mức tính OT:
              <ul>
                <li><Text strong>Ngày thường:</Text> 150% lương cơ bản.</li>
                <li><Text strong>Cuối tuần:</Text> 200% lương cơ bản.</li>
                <li><Text strong>Ngày lễ:</Text> 300% lương cơ bản.</li>
              </ul>
            </li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 5. Nghỉ phép và nghỉ lễ</Title>
        <Paragraph>
          <ul>
            <li><Text strong>Nghỉ phép năm:</Text> Tối đa 12 ngày/năm.</li>
            <li><Text strong>Nghỉ lễ, Tết:</Text> Theo lịch nghỉ lễ nhà nước.</li>
          </ul>
        </Paragraph>

        <Title level={4}>🔹 6. Kỷ luật và xử lý vi phạm</Title>
        <Paragraph>
          <ul>
            <li>Vi phạm nội quy có thể bị <Text strong>nhắc nhở, phạt tiền hoặc kỷ luật</Text> tùy theo mức độ.</li>
            <li>Các hành vi gian lận, trộm cắp, quấy rối có thể bị <Text strong>buộc thôi việc ngay lập tức</Text>.</li>
            <li>Nhân viên có quyền khiếu nại nếu thấy hình phạt không hợp lý.</li>
          </ul>
        </Paragraph>
      </Typography>
    </div>
  );
};

export default WorkRegulations;
