import React from "react";
import { Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

const BenefitPolicy = () => {
    return (
        <div style={{ overflowX: 'auto', padding: '20px 40px', height: '85vh' }}>
            <Typography>
                <Title level={4}>🎯 CHÍNH SÁCH PHÚC LỢI</Title>

                <Title level={4}>🔹 1. Các loại phúc lợi</Title>
                <Paragraph>
                    <Text strong>✅ Phúc lợi bắt buộc:</Text> Theo quy định của nhà nước.
                    <ul>
                        <li><Text strong>Bảo hiểm xã hội (BHXH), Bảo hiểm y tế (BHYT), Bảo hiểm thất nghiệp (BHTN).</Text></li>
                        <li>Chế độ thai sản, ốm đau và nghỉ phép năm được áp dụng theo quy định của luật lao động, nhằm đảm bảo quyền lợi cho người lao động trong các trường hợp sinh con, mắc bệnh hoặc cần thời gian nghỉ ngơi hàng năm.</li>
                    </ul>
                </Paragraph>
                <Paragraph>
                    <Text strong>✅ Phúc lợi tự nguyện:</Text> Do công ty hỗ trợ thêm.
                    <ul>
                        <li><Text strong>Khám sức khỏe định kỳ</Text>: Hỗ trợ chi phí khám bệnh hàng năm.</li>
                        <li><Text strong>Chế độ thai sản mở rộng</Text>: Hỗ trợ tài chính cho nhân viên sinh con.</li>
                        <li><Text strong>Gói bảo hiểm sức khỏe</Text>: Bảo hiểm tư nhân do công ty tài trợ.</li>
                    </ul>
                </Paragraph>

                <Title level={4}>🔹 2. Chế độ thưởng và đãi ngộ</Title>
                <Paragraph>
                    <ul>
                        <li><Text strong>Thưởng hiệu suất</Text>: Dựa trên kết quả làm việc.</li>
                        <li><Text strong>Thưởng doanh thu</Text>: Dành cho bộ phận kinh doanh.</li>
                        <li><Text strong>Thưởng Lễ, Tết</Text>: Thưởng tháng 13, sinh nhật, ngày lễ lớn.</li>
                        <li><Text strong>Quà tặng nhân dịp đặc biệt</Text>: Cưới hỏi, sinh con, hiếu hỷ.</li>
                    </ul>
                </Paragraph>

                <Title level={4}>🔹 3. Chế độ nghỉ phép & hỗ trợ</Title>
                <Paragraph>
                    <ul>
                        <li><Text strong>Nghỉ phép năm:</Text> Tối thiểu 12 ngày/năm.</li>
                        <li><Text strong>Nghỉ việc riêng có lương</Text>: Hiếu hỷ, kết hôn.</li>
                        <li><Text strong>Hỗ trợ ăn trưa, đi lại</Text>: Trợ cấp hàng tháng.</li>
                    </ul>
                </Paragraph>

                <Title level={4}>🔹 4. Hoạt động ngoại khóa & phát triển</Title>
                <Paragraph>
                    <ul>
                        <li><Text strong>Teambuilding & du lịch</Text>: Công ty tổ chức ít nhất 1 lần/năm.</li>
                        <li><Text strong>Khóa đào tạo & phát triển</Text>: Hỗ trợ học phí các khóa kỹ năng.</li>
                        <li><Text strong>Hoạt động văn hóa, thể thao</Text>: CLB thể thao, sự kiện nội bộ.</li>
                    </ul>
                </Paragraph>
            </Typography>
        </div>
    );
};

export default BenefitPolicy;
