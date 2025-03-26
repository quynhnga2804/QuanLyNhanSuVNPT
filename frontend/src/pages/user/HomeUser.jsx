// import React, { useEffect, useState } from "react";
// import { Layout, Card, Typography, Avatar, Table, Badge, Flex} from "antd";
// import { ClockCircleOutlined, FileTextOutlined, WalletOutlined, BarChartOutlined, InsuranceOutlined } from "@ant-design/icons";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import '../../AppUser.css';
// import axios from "axios";
// import Link from "antd/es/typography/Link";

// const { Content } = Layout;
// const { Header } = Layout;
// const { Title, Text } = Typography;

// // Dữ liệu lương theo tháng
// const salaryData = [
//   { month: "Jan", salary: 8000000 },
//   { month: "Feb", salary: 8200000 },
//   { month: "Mar", salary: 7800000 },
//   { month: "Apr", salary: 8500000 },
//   { month: "May", salary: 9000000 },
//   { month: "Jun", salary: 8700000 },
// ];

// const contractData = [
//   { key: "1", id: "HD001", name: "Hợp đồng chính thức", date: "01/01/2024" },
//   { key: "2", id: "HD002", name: "Hợp đồng thử việc", date: "15/12/2023" },
// ];

// const HomeUser = () => {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [imageUrl, setImageUrl] = useState(null);

//   useEffect(() => {
//       const fetchData = async () => {
//           try {
//               const token = localStorage.getItem("token");

//               // Gọi API lấy thông tin nhân viên
//               const employeeResponse = await fetch("http://localhost:5000/api/user/employeeinfo", {
//                   headers: { Authorization: `Bearer ${token}` }
//               });
//               const employeeData = await employeeResponse.json();
//               if (!employeeResponse.ok) throw new Error(employeeData.message);
//               setEmployee(employeeData);

//           } catch (error) {
//               message.error(error.message);
//           } finally {
//               setLoading(false);
//           }
//       };

//       fetchData();
//   }, []);

//   useEffect(() => {
//     if (employee?.Image) {
//         const fetchImage = async () => {
//             try {
//                 const token = localStorage.getItem("token"); // Lấy token
//                 const response = await axios.get(
//                     `http://localhost:5000/uploads/${employee.Image}`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                         responseType: "blob",
//                     }
//                 );
//                 const imageBlob = new Blob([response.data]);
//                 setImageUrl(URL.createObjectURL(imageBlob)); // Hiển thị ảnh
//             } catch (error) {
//                 console.error("Lỗi tải ảnh:", error);
//             }
//         };
//         fetchImage();
//     }
// }, [employee]);


//   return (
//     <Layout className="home-container"  >
//       <Content style={{ padding: "20px 40px" }}>
//         {/* Phần trên - Thông tin nhân viên & Nhắc nhở */}
//         <Flex justify="space-between" gap={16}>
//           <Card style={{ flex: 2 }}>
//             <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
//               <Title level={4} className="header-ttnv">Thông tin nhân viên</Title>
//               <hr />
//             </Header>
//             <Flex align="center" gap={16}>
//               <Flex className="sub-info-employee" style={{width:'100%'}}>
//                 <Flex vertical style={{margin:'0 3rem 0 1rem', textAlign:'center'}}>
//                   <Avatar src={imageUrl} size={180} style={{ border: '2px solid #ddd', objectFit:'cover' }} />
//                   <Link to="/profile" style={{margin:'10px'}}>Chi tiết thông tin nhân viên</Link>
//                 </Flex>
//                 <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
//                   <Text><strong>Mã nhân viên:</strong> {employee?.EmployeeID}</Text>
//                   <Text><strong>Số Điện Thoại:</strong> {employee?.PhoneNumber}</Text>
//                   <Text><strong>Ngày Sinh:</strong> {employee?.DateOfBirth}</Text>
//                   <Text><strong>Giới Tính:</strong> {employee?.Gender}</Text>
//                   <Text><strong>Địa Chỉ:</strong> {employee?.Address}</Text>
//                 </Flex>
//                 <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
//                 <Text><strong>Email Cá Nhân:</strong> {employee?.PersonalEmail}</Text>
//                   <Text><strong>Email Công Việc:</strong> {employee?.WorkEmail}</Text>
//                   <Text><strong>Chức Vụ:</strong> {employee?.Position}</Text>
//                   <Text><strong>Ngày Bắt Đầu:</strong> {employee?.StartDate}</Text>
//                   <Text><strong>Phòng Ban:</strong> {employee?.Department?.DepartmentName || "Chưa có phòng ban"}</Text>
//                 </Flex>
//               </Flex>
//             </Flex>
//           </Card>
//           <Card style={{ flex: 1 }}>
//             <Title level={5}>Nhắc nhở</Title>
//             <Badge count={2} style={{ backgroundColor: "#faad14" }} />
//             <marquee class="marquee" behavior="scroll" direction="up" scrollamount="2">
//               <Text>- Lịch học thay đổi: Lịch sử Đảng, ngày 26/03/2025.</Text>
//               <br />
//               <Text>- Đăng ký môn học kỳ mới trước 01/04/2025.</Text>
//             </marquee>
//           </Card>
//         </Flex>

//         {/* Phần giữa - Các mục chức năng */}
//         <Flex justify="space-between" gap={16} style={{ margin: "24px 0", width:'100%' }}>
//           {[
//             { icon: <ClockCircleOutlined />, text: "Chấm công" },
//             { icon: <InsuranceOutlined />, text: "Bảo hiểm" },
//             { icon: <FileTextOutlined />, text: "Hợp đồng" },
//             { icon: <WalletOutlined />, text: "Bảng lương" },
//             { icon: <BarChartOutlined />, text: "Tăng ca" },
//           ].map((item, index) => (
//             <Card key={index} hoverable style={{ width: '100%', textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
//               <div style={{ fontSize: "3rem", marginBottom: "8px", color:'#3092df' }}>{item.icon}</div>
//               <Text>{item.text}</Text>
//             </Card>
//           ))}
//         </Flex>

//         {/* Phần dưới - Biểu đồ lương & Danh sách hợp đồng */}
//         <Flex gap={16}>
//           <Card style={{ flex: 1 }}>
//             <Title level={5}>Biểu đồ lương theo tháng</Title>
//             <ResponsiveContainer width="100%" height={250} style={{padding: '6px'}}>
//               <LineChart data={salaryData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="salary" stroke="#8884d8" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//           <Card style={{ flex: 1 }}>
//             <Title level={5}>Danh sách hợp đồng</Title>
//             <Table dataSource={contractData} columns={[
//               { title: "Mã HĐ", dataIndex: "id", key: "id" },
//               { title: "Loại HĐ", dataIndex: "name", key: "name" },
//               { title: "Ngày ký", dataIndex: "date", key: "date" },
//             ]} pagination={false} />
//           </Card>
//         </Flex>
//       </Content>
//     </Layout>
//   );
// };

// export default HomeUser;


import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Avatar, Table, Badge, Flex, message } from "antd";
import { ClockCircleOutlined, FileTextOutlined, WalletOutlined, BarChartOutlined, InsuranceOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import '../../App.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const { Content } = Layout;
const { Header } = Layout;
const { Title, Text } = Typography;

// Dữ liệu lương theo tháng
const salaryData = [
  { month: "Jan", salary: 8000000 },
  { month: "Feb", salary: 8200000 },
  { month: "Mar", salary: 7800000 },
  { month: "Apr", salary: 8500000 },
  { month: "May", salary: 9000000 },
  { month: "Jun", salary: 8700000 },
];

const contractData = [
  { key: "1", id: "HD001", name: "Hợp đồng chính thức", date: "01/01/2024" },
  { key: "2", id: "HD002", name: "Hợp đồng thử việc", date: "15/12/2023" },
];

const HomeUser = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Gọi API lấy thông tin nhân viên
        const employeeResponse = await fetch("http://localhost:5000/api/user/employeeinfo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const employeeData = await employeeResponse.json();
        if (!employeeResponse.ok) throw new Error(employeeData.message);
        setEmployee(employeeData);

      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (employee?.Image) {
      const fetchImage = async () => {
        try {
          const token = localStorage.getItem("token"); // Lấy token
          const response = await axios.get(
            `http://localhost:5000/uploads/${employee.Image}`,
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
  }, [employee]);

  const handleNavigate = (path) => {
    navigate(path);
  };

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
              <Flex className="sub-info-employee" style={{ width: '100%' }}>
                <Flex vertical style={{ margin: '0 3rem 0 1rem', textAlign: 'center' }}>
                  <Avatar src={imageUrl} size={180} style={{ border: '2px solid #ddd', objectFit: 'cover' }} />
                  <Link to="/user/profile" style={{ margin: '10px', cursor: 'pointer' }}>Chi tiết thông tin nhân viên</Link>
                </Flex>
                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                  <Text><strong>Mã nhân viên:</strong> {employee?.EmployeeID}</Text>
                  <Text><strong>Số Điện Thoại:</strong> {employee?.PhoneNumber}</Text>
                  <Text><strong>Ngày Sinh:</strong> {employee?.DateOfBirth}</Text>
                  <Text><strong>Giới Tính:</strong> {employee?.Gender}</Text>
                  <Text><strong>Địa Chỉ:</strong> {employee?.Address}</Text>
                </Flex>
                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                  <Text><strong>Email Cá Nhân:</strong> {employee?.PersonalEmail}</Text>
                  <Text><strong>Email Công Việc:</strong> {employee?.WorkEmail}</Text>
                  <Text><strong>Chức Vụ:</strong> {employee?.Position}</Text>
                  <Text><strong>Ngày Bắt Đầu:</strong> {employee?.StartDate}</Text>
                  <Text><strong>Phòng Ban:</strong> {employee?.Department?.DepartmentName || "Chưa có phòng ban"}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Title level={5}>Nhắc nhở</Title>
            <Badge count={2} style={{ backgroundColor: "#faad14" }} />
            <marquee class="marquee" behavior="scroll" direction="up" scrollamount="2">
              <Text>- Lịch học thay đổi: Lịch sử Đảng, ngày 26/03/2025.</Text>
              <br />
              <Text>- Đăng ký môn học kỳ mới trước 01/04/2025.</Text>
            </marquee>
          </Card>
        </Flex>

        {/* Phần giữa - Các mục chức năng */}
        <Flex justify="space-between" gap={16} style={{ margin: "24px 0", width: '100%' }}>
          {[
            { icon: <ClockCircleOutlined />, text: "Chấm công", path: "/user/attendance" },
            { icon: <InsuranceOutlined />, text: "Bảo hiểm", path: "/user/insurance" },
            { icon: <FileTextOutlined />, text: "Hợp đồng", path: "/user/contracts" },
            { icon: <WalletOutlined />, text: "Bảng lương", path: "/user/salary" },
            { icon: <BarChartOutlined />, text: "Tăng ca", path: "/user/overtime" },
          ].map((item, index) => (
            <Card key={index} hoverable style={{ width: '100%', textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", cursor: 'pointer' }} onClick={() => handleNavigate(item.path)}>
              <div style={{ fontSize: "3rem", marginBottom: "8px", color: '#3092df' }}>{item.icon}</div>
              <Text>{item.text}</Text>
            </Card>
          ))}
        </Flex>

        {/* Phần dưới - Biểu đồ lương & Danh sách hợp đồng */}
        <Flex gap={16}>
          <Card style={{ flex: 1 }}>
            <Title level={5}>Biểu đồ lương theo tháng</Title>
            <ResponsiveContainer width="100%" height={250} style={{ padding: '6px' }}>
              <LineChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="salary" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card style={{ flex: 1 }}>
            <Title level={5}>Danh sách hợp đồng</Title>
            <Table dataSource={contractData} columns={[
              { title: "Mã HĐ", dataIndex: "id", key: "id" },
              { title: "Loại HĐ", dataIndex: "name", key: "name" },
              { title: "Ngày ký", dataIndex: "date", key: "date" },
            ]} pagination={false} />
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default HomeUser;