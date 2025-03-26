import React from 'react';
import { Table, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

const SalaryPolicy = () => {
    const salaryData = [
        { role: "Nhân viên văn phòng", salary: "10,000,000 VNĐ/tháng" },
        { role: "Trưởng phòng", salary: "20,000,000 VNĐ/tháng" },
    ];

    const columns = [
        { title: "Chức danh", dataIndex: "role", key: "role" },
        { title: "Mức lương cơ bản", dataIndex: "salary", key: "salary" },
    ];

    return (
        <div style={{ overflowX: 'auto', padding: '20px 40px', height: '85vh' }}>
            <Typography>
                <Title level={4}>📌 CHÍNH SÁCH LƯƠNG</Title>

                <Title level={4}>🔹 1. Cách xác định lương cơ bản</Title>
                <Paragraph>
                    - Dựa trên <Text strong>chức danh công việc</Text> và <Text strong>bậc lương</Text>.
                    <br />- Tham chiếu theo <Text strong>mặt bằng thị trường</Text>, năng lực nhân viên và mức lương tối thiểu vùng.
                </Paragraph>
                <Table columns={columns} dataSource={salaryData} pagination={false} style={{border: '1px solid lightgray'}} />

                <Title level={4}>🔹 2. Hình thức trả lương</Title>
                <Paragraph>
                    ✅ <Text strong>Lương theo tháng:</Text> Trả cố định mỗi tháng, thường áp dụng cho nhân viên văn phòng.
                    <br />✅ <Text strong>Lương theo ngày công:</Text> Dựa trên số ngày đi làm thực tế.
                    <br />✅ <Text strong>Lương theo giờ:</Text> Tính theo số giờ làm việc (thường áp dụng cho part-time, thời vụ).
                    <br />✅ <Text strong>Lương theo sản phẩm:</Text> Dựa trên số lượng hoặc chất lượng sản phẩm hoàn thành.
                </Paragraph>

                <Title level={4}>🔹 3. Phụ cấp và trợ cấp</Title>
                <Paragraph>
                    <ul>
                        <li>Phụ cấp ăn trưa: <Text strong>800,000 VNĐ/tháng</Text></li>
                        <li>Phụ cấp đi lại: <Text strong>500,000 VNĐ/tháng</Text></li>
                        <li>Phụ cấp nhà ở: <Text strong>1,000,000 VNĐ/tháng</Text></li>
                        <li>Trợ cấp công tác (trả theo số ngày đi công tác).</li>
                    </ul>
                </Paragraph>

                <Title level={4}>🔹 4. Thưởng & Phạt</Title>
                <Paragraph>
                    ✅ <Text strong>Các khoản thưởng:</Text>
                    <ul>
                        <li>Thưởng hiệu suất (dựa trên KPIs).</li>
                        <li>Thưởng doanh số (áp dụng cho sales, kinh doanh).</li>
                        <li>Thưởng Lễ, Tết (thưởng tháng 13, thưởng sinh nhật...).</li>
                    </ul>
                    ✅ <Text strong>Các khoản phạt:</Text>
                    <ul>
                        <li>Nghỉ không phép → Trừ lương.</li>
                        <li>Đi làm muộn → Phạt tiền hoặc trừ lương.</li>
                        <li>Vi phạm nội quy → Phạt theo quy định công ty.</li>
                    </ul>
                </Paragraph>

                <Title level={4}>🔹 5. Bảo hiểm và thuế</Title>
                <Paragraph>
                    - <Text strong>Bảo hiểm bắt buộc:</Text> BHXH, BHYT, BHTN theo quy định nhà nước.
                    <br />- <Text strong>Thuế TNCN:</Text> Khấu trừ theo thu nhập chịu thuế.
                </Paragraph>
                <Paragraph>
                    <Text strong>📌 Ví dụ:</Text>
                    <pre>
                        Lương trước thuế: 15,000,000 VNĐ
                        - Bảo hiểm (10.5%): 1,575,000 VNĐ
                        - Thuế TNCN: 300,000 VNĐ
                        = Lương thực nhận: 13,125,000 VNĐ
                    </pre>
                </Paragraph>

                <Title level={4}>🔹 6. Cách thức thanh toán lương</Title>
                <Paragraph>
                    <ul>
                        <li>Chuyển khoản ngân hàng hay trả tiền mặt?</li>
                        <li>Ngày trả lương cố định (VD: mùng 5 hàng tháng).</li>
                        <li>Cách xử lý khi chậm lương.</li>
                    </ul>
                </Paragraph>
            </Typography>
        </div>
    )
};

export default SalaryPolicy;