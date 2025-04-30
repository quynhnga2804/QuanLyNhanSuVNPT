import React, { useContext, useEffect, useState, useRef } from "react";
import { Layout, Card, Typography, Avatar, Table, Flex, message } from "antd";
import { ClockCircleOutlined, FileTextOutlined, DollarOutlined, BarChartOutlined } from "@ant-design/icons";
import { Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from "recharts";
import '../../App.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { NotificationContext } from "./NotificationContext";

const { Content } = Layout;
const { Header } = Layout;
const { Title, Text } = Typography;

const HomeUser = ({employeeinfo, monthlySalaryUser, contractUsers}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [salaryChartData, setSalaryChartData] = useState([]);
  const {notifications, fetchNotifications } = useContext(NotificationContext);
  const token = localStorage.getItem('token');
  const hasNotified = useRef(false);
  
  const navigate = useNavigate(); 
  const getEqualStepDomainPF = (data, keys, padding = 500000, stepCount = 5) => {
    if (!data.length) return [0, 1000];
    // Lấy giá trị max từ dữ liệu
    const values = data.flatMap(item => keys.map(key => parseFloat(item[key] || 0)) );
    let max = Math.max(...values);
    if (max === 0) return [0, 1000, [0, 200, 400, 600, 800, 1000]];
    
    max += padding; // Thêm padding để tránh max trùng giá trị cao nhất

    // Xác định khoảng làm tròn hợp lý dựa vào max
    let roundBase;
    if (max <= 1000000) {
        roundBase = 1000000;  // Nếu max nhỏ hơn 1 triệu, làm tròn lên 1 triệu
    } else {
        roundBase = Math.pow(10, Math.floor(Math.log10(max))); // Tìm bội số của 10 phù hợp
    }

    // Làm tròn max lên bội số gần nhất của roundBase
    max = Math.ceil(max / roundBase) * roundBase;

    // Xác định stepSize sao cho có stepCount bước chia
    const stepSize = max / stepCount;
    const ticks = Array.from({ length: stepCount + 1 }, (_, i) => i * stepSize);

    return [0, max, ticks];
  };

  const getEqualStepDomain = (data, keys, padding = 2000000, stepCount = 6) => {
    if (!data.length) return [0, 1000];

    const values = data.flatMap(item =>  keys.map(key => parseFloat(item[key] || 0)) );

    let max = Math.max(...values);
    if (max === 0) return [0, 1000]; 

    max += padding;
    const stepSize = Math.ceil((max + 1) / stepCount / 2000000) * 2000000;
    const roundedMax = Math.ceil(max / stepSize) * stepSize;

    return [0, roundedMax];
  };

  const salaryDomain = getEqualStepDomain(monthlySalaryUser, ["NetSalary"]);
  
  const salaryTicks = Array.from({ length: 6 }, (_, i) => (i * salaryDomain[1]) / 5);
  const [minPF, maxPF, pfTicks] = getEqualStepDomainPF(monthlySalaryUser, ["PrizeMoney", "Forfeit"]);

  const salaryChartDatas = monthlySalaryUser.slice(-5); // Lấy 5 phần tử cuối cùng

  useEffect(() => {
    fetchNotifications(true);
  }, [])

  useEffect(() => {
    if (employeeinfo?.Image) {
      const fetchImage = async () => {
        try {
          const token = localStorage.getItem("token"); // Lấy token
          const response = await axios.get(`http://localhost:5000/uploads/${employeeinfo.Image}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          const imageBlob = new Blob([response.data]);
          setImageUrl(URL.createObjectURL(imageBlob)); // Hiển thị ảnh
        } catch (error) {
          console.error("Lỗi tải ảnh:", error);
        }
      };
      fetchImage();
    }
  }, [employeeinfo]);

  useEffect(() => {
    if (monthlySalaryUser && monthlySalaryUser.length > 0) {
      const data = monthlySalaryUser.map(item => ({
        month: item.PayrollCycle?.PayrollName || item.ID_PayrollCycle,
        salary: Number(item.NetSalary),
      }));
      setSalaryChartData(data);
    }
  }, [monthlySalaryUser]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const notifyExpiringContracts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/notify-expiring-contracts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success(response.data.message);
      } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error);
      }
    };

    if (!hasNotified.current) {
      notifyExpiringContracts();
      hasNotified.current = true;
    }

    // Nếu cần gọi API định kỳ mỗi ngày, bạn có thể dùng setInterval:
    const interval = setInterval(notifyExpiringContracts, 24 * 60 * 60 * 1000); // 24 giờ (24h * 60p * 60s * 1000ms)

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, []);

  return (
    <Layout className="home-container" >
      <Content style={{ padding: "20px 40px" }}>
        {/* Phần trên - Thông tin nhân viên & Nhắc nhở */}
        <Flex justify="space-between" gap={16}>
          <Card style={{ flex: 2 }}>
            <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
              <Title level={4} className="header-ttnv">Thông tin nhân viên</Title>
              <hr />
            </Header>
            <Flex align="center" gap={16}>
              <Flex className="sub-info-employeeinfo" style={{ width: '100%' }}>
                <Flex vertical style={{ margin: '0 3rem 0 1rem', textAlign: 'center' }}>
                  <Avatar src={imageUrl} size={180} style={{ border: '2px solid #ddd', objectFit: 'cover' }} />
                  <Link to="/user/generalinfo/profile" style={{ margin: '10px', cursor: 'pointer' }}>Chi tiết thông tin nhân viên</Link>
                </Flex>
                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                  <Text><strong>Mã nhân viên:</strong> {employeeinfo?.EmployeeID}</Text>
                  <Text><strong>Số Điện Thoại:</strong> {employeeinfo?.PhoneNumber}</Text>
                  <Text><strong>Ngày Sinh:</strong> {employeeinfo?.DateOfBirth}</Text>
                  <Text><strong>Giới Tính:</strong> {employeeinfo?.Gender}</Text>
                  <Text><strong>Địa Chỉ:</strong> {employeeinfo?.Address}</Text>
                </Flex>
                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                  <Text><strong>Email Cá Nhân:</strong> {employeeinfo?.PersonalEmail}</Text>
                  <Text><strong>Email Công Việc:</strong> {employeeinfo?.WorkEmail}</Text>
                  <Text><strong>Chức Vụ:</strong> {employeeinfo?.Position}</Text>
                  <Text><strong>Ngày Bắt Đầu:</strong> {employeeinfo?.StartDate}</Text>
                  <Text><strong>Phòng Ban:</strong> {employeeinfo?.Department?.DepartmentName || "Chưa có phòng ban"}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Title level={5}>Thông báo</Title>
            {notifications.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '1rem', color: '#999' }}>
                Không có thông báo mới nào!
              </Text>
            ) : (
            <marquee class="marquee" behavior="scroll" direction="up" scrollamount="2">
              {notifications
                .filter((noti) => !noti.IsRead) // chỉ lấy thông báo chưa đọc
                .map((noti) => (
                  <div key={noti.NotificationID}>
                    <Text>- {noti.Message}</Text>
                    <br />
                  </div>
                ))}
            </marquee>
            )}
          </Card>
        </Flex>

        {/* Phần giữa - Các mục chức năng */}
        <Flex justify="space-between" gap={16} style={{ margin: "24px 0", width: '100%' }}>
          {[
            { icon: <ClockCircleOutlined />, text: "Chấm công", path: "/user/attendances" },
            { icon: <FileTextOutlined />, text: "Hợp đồng", path: "/user/generalinfo/contracts" },
            { icon: <DollarOutlined />, text: "Bảng lương", path: "/user/monthlysalaries" },
            { icon: <BarChartOutlined />, text: "Tăng ca", path: "/user/overtimes" },
          ].map((item, index) => (
            <Card key={index} hoverable style={{ width: '100%', textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", cursor: 'pointer' }} onClick={() => handleNavigate(item.path)}>
              <div style={{ fontSize: "3rem", marginBottom: "8px", color: '#2994C1' }}>{item.icon}</div>
              <Text>{item.text}</Text>
            </Card>
          ))}
        </Flex>

        {/* Phần dưới - Biểu đồ lương & Danh sách hợp đồng */}
        <Flex gap={16}>
          <Card style={{ flex: 1, minHeight: '350px' }}>
              <Title level={5}>Biểu đồ Lương và Thưởng/Phạt</Title>
              {
                salaryChartData.length === 0 ? (
                    <Text className="none-info">Chưa có dữ liệu lương!</Text>
                ) : (
              <ResponsiveContainer width="100%" height={270} style={{ padding: '6px' }}>
                <ComposedChart data={salaryChartDatas}  margin={{ top: 20, right: 40, left: 20, bottom: 0 }} >
                  <XAxis dataKey="PayrollCycle.PayrollName" label={{ value: 'Kỳ lương', position: 'insideBottom', offset: -5 }} />

                  <YAxis
                    width={80}
                    yAxisId="left"
                    domain={[minPF, maxPF]}
                    ticks={pfTicks}
                    interval="preserveEnd"
                    tickFormatter={(value) => value.toLocaleString()}
                    label={{
                      value: 'Thưởng/Phạt (VNĐ)',
                      angle: -90,
                      position: 'outsideLeft',
                      dx: -50, // đẩy label ra xa hơn
                      style: { textAnchor: 'middle', fill: '#555' },
                    }}
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    width={80}
                    domain={salaryDomain}
                    ticks={salaryTicks}
                    interval="preserveEnd"
                    tickFormatter={(value) => value.toLocaleString()}
                    allowDecimals={false}
                    label={{
                      value: 'Lương tháng (VNĐ)',
                      angle: 90,
                      position: 'outsideRight',
                      dx: 60, // đẩy label ra xa khỏi trục phải
                      style: { textAnchor: 'middle', fill: '#555' },
                    }}
                  />

                <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString('vi-VN')} VNĐ`, name]} />

                  <Legend  verticalAlign="bottom" align="center"  layout="horizontal" />
                  <Line yAxisId="right" dataKey="NetSalary" stroke="#4caf50" name="Lương thực lĩnh" strokeWidth={2} />
                  <Bar yAxisId="left" dataKey="PrizeMoney" fill="#BBE9FF" name="Thưởng" />
                  <Bar yAxisId="left" dataKey="Forfeit" fill="#E16A54" name="Phạt" />
                </ComposedChart>
              </ResponsiveContainer>
              )}
            {/* </div> */}
          </Card>


          <Card style={{ flex: 1 }}>
            <Title level={5}>Danh sách hợp đồng</Title>
            {
                contractUsers.length === 0 ? (
                  <Text className="none-info">Chưa có dữ liệu hợp đồng!</Text>
                ) : (
            
            <Table 
                dataSource={contractUsers} 
                columns={[
                { 
                  title: "Mã HĐ", 
                  dataIndex: "ID_Contract"
                },
                { 
                  title: "Loại HĐ", 
                  dataIndex: "ContractID", 
                  render: (text, record) => record.LaborContract ? record.LaborContract.ContractType : "Chưa có hợp đồng",
                },
                { 
                  title: "Ngày bắt đầu", 
                  dataIndex: "StartDate"
                },
                { 
                  title: "Ngày kết thúc", 
                  dataIndex: "EndDate" 
                },
                { 
                  title: "Trạng thái", 
                  dataIndex: "Status",
                  render: (text, record) => {
                    const today = new Date();
                    const endDate = record.EndDate ? new Date(record.EndDate) : null;
                    const isExpired = endDate && endDate < today;
                    const statusContract = isExpired ? "Đã hết hạn" : "Hoạt động";
                    const statusColor = isExpired ? '#FF3333' : '#339933';
                    return <span style={{color: statusColor, fontWeight: 'bold'}}>{statusContract}</span>
                  }
                },
              ]} pagination={false} />
          )}
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default HomeUser;