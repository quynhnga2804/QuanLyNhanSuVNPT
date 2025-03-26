import React, { useEffect, useState } from "react";
import { Layout, Spin, message, Avatar, Typography, Flex, Row, Col, Image } from "antd";
import axios from "axios";
// import '../../Usercss/EmployeeProfile.css';
import '../../App.css';

const { Header } = Layout;
const { Title, Text } = Typography;

const EmployeeProfile = () => {
    const [employee, setEmployee] = useState(null);
    const [jobProfile, setJobProfile] = useState(null);
    const [personalProfile, setPersonalProfile] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]); // Dùng để lưu danh sách thành viên gia đình
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

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

                // Gọi API lấy thông tin công việc
                const jobResponse = await fetch("http://localhost:5000/api/user/jobinfo", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const jobData = await jobResponse.json();
                if (!jobResponse.ok) throw new Error(jobData.message);
                setJobProfile(jobData);

                // Gọi API lấy thông tin cá nhân
                const personalResponse = await fetch("http://localhost:5000/api/user/personalinfo", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const personalData = await personalResponse.json();
                if (!personalResponse.ok) throw new Error(personalData.message);
                setPersonalProfile(personalData);

                // Gọi API lấy thông tin thành viên gia đình
                const familyResponse = await fetch("http://localhost:5000/api/user/familymembers", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const familyData = await familyResponse.json();
                if (!familyResponse.ok) throw new Error(familyData.message);
                setFamilyMembers(familyData);

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
    

    return (
        <Layout className='employee-profile'>
            {loading ? (
                <Spin size="large" style={{ margin: 'auto' }} />
            ) : (
                <Flex vertical gap={20} style={{ width: '100%' }}>
                    {/* Phần trên: Ảnh + Thông tin nhân viên */}
                    <Flex gap={20} style={{ width: '100%' }}>
                        <Flex vertical align="center" style={{ flex: 1 }}>
                            {/* <Avatar src={`/Images/${employee?.Image}`} size={220} style={{ border: '2px solid #ddd' }} /> */}
                            {/* <Avatar src={`http://localhost:5000/uploads/${employee?.Image}`} size={220} style={{ border: '2px solid #ddd' }} /> */}
                            <Image src={imageUrl} style={{ border: '2px solid #ddd', }} />
                            <Title level={3} style={{ marginTop: '10px' }}>{employee?.FullName}</Title>
                            <Text>Mã NV: {employee?.EmployeeID}</Text>
                        </Flex>

                        <Flex vertical style={{ flex: 2 }}>
                            <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                                <Title level={3} className="header-ttnv">Thông tin nhân viên</Title>
                                <hr />
                            </Header>

                            <Flex className="sub-info-employee">
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    <Text><strong>Số Điện Thoại:</strong> {employee?.PhoneNumber}</Text>
                                    <Text><strong>Ngày Sinh:</strong> {employee?.DateOfBirth}</Text>
                                    <Text><strong>Giới Tính:</strong> {employee?.Gender}</Text>
                                    <Text><strong>Địa Chỉ:</strong> {employee?.Address}</Text>
                                    <Text><strong>Email Cá Nhân:</strong> {employee?.PersonalEmail}</Text>
                                </Flex>
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    <Text><strong>Email Công Việc:</strong> {employee?.WorkEmail}</Text>
                                    <Text><strong>Chức Vụ:</strong> {employee?.Position}</Text>
                                    <Text><strong>Ngày Bắt Đầu:</strong> {employee?.StartDate}</Text>
                                    <Text><strong>Phòng Ban:</strong> {employee.Department ? employee.Department.DepartmentName : "Chưa có phòng ban"}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Thông tin công việc */}
                    <Flex vertical className="container-employee-info">
                        <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                            <Title level={3}>Thông tin công việc</Title>
                            <hr />
                        </Header>
                        <Flex className="sub-info-employee">
                            <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                <Text><strong>Trạng thái làm việc:</strong> {jobProfile?.EmploymentStatus}</Text>
                                <Text><strong>Quản lý trực tiếp:</strong> {jobProfile?.Manager}</Text>
                                <Text><strong>Số giờ làm tiêu chuẩn:</strong> {jobProfile?.StandardWorkingHours} giờ</Text>
                            </Flex>
                            <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                <Text><strong>Loại nhân viên:</strong> {jobProfile?.EmployeesType}</Text>
                                <Text><strong>Số ngày nghỉ phép còn lại:</strong> {jobProfile?.RemainingLeaveDays} ngày</Text>
                                <Text><strong>Liên hệ khẩn cấp:</strong> {jobProfile?.EmergencyContactName} - {jobProfile?.EmergencyContactNumber}</Text>
                            </Flex>
                            <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                <Text><strong>Ngày nghỉ việc (nếu có):</strong> {jobProfile?.ResignationsDate || "Chưa nghỉ"}</Text>
                                <Text><strong>Lý do nghỉ việc:</strong> {jobProfile?.ResignationsReason || "Không có"}</Text>
                                <Text><strong>Lương cơ bản:</strong> {jobProfile?.BaseSalary} VNĐ</Text>
                                <Text><strong>Trợ cấp:</strong> {jobProfile?.Allowance} VNĐ</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Thông tin cá nhân */}
                    <Flex vertical className="container-employee-info">
                        <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                            <Title level={3}>Thông tin cá nhân</Title>
                            <hr />
                        </Header>
                        <Flex className="sub-info-employee">
                            <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                <Text><strong>Quốc tịch:</strong> {personalProfile?.Nationality}</Text>
                                <Text><strong>Nơi sinh:</strong> {personalProfile?.PlaceOfBirth}</Text>
                                <Text><strong>Số CCCD:</strong> {personalProfile?.ID_Card}</Text>
                            </Flex>
                            <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                <Text><strong>Nơi cấp CCCD:</strong> {personalProfile?.ID_CardIssuedPlace}</Text>
                                <Text><strong>Trình độ học vấn:</strong> {personalProfile?.Education}</Text>
                                <Text><strong>Bằng cấp:</strong> {personalProfile?.Degree}</Text>
                            </Flex>
                            <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                <Text><strong>Chuyên ngành:</strong> {personalProfile?.Major}</Text>
                                <Text><strong>Mã số thuế:</strong> {personalProfile?.TaxCode}</Text>
                                <Text><strong>Số tài khoản ngân hàng:</strong> {personalProfile?.BankAccount}</Text>
                                <Text><strong>Tình trạng hôn nhân:</strong> {personalProfile?.MaritalStatus}</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Thông tin thành viên gia đình */}
                    <Flex vertical className="container-employee-info">
                        <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                            <Title level={3}>Thông tin thành viên gia đình</Title>
                            <hr />
                        </Header>
                        <Flex className="sub-info-employee">
                            <Flex vertical className="sub-info" style={{ flex: 1 }}>
                                {familyMembers.length > 0 ? (
                                    familyMembers.map((member, index) => (
                                        <div key={index}>
                                            {/* <Flex gap={20} justify="space-between" style={{ width: '100%' }}>
                                                <Text><strong>Tên:</strong> {member.FullName}</Text>
                                                <Text><strong>Quan hệ:</strong> {member.Relationship}</Text>
                                                <Text><strong>Ngày sinh:</strong> {member.DateOfBirth}</Text>
                                                <Text><strong>Giới tính:</strong> {member.Gender}</Text>
                                                <Text><strong>Số điện thoại:</strong> {member.PhoneNumber}</Text>
                                            </Flex> */}
                                            <Row gutter={16}>
                                                <Col span={4}><Text><strong>Tên:</strong> {member.FullName}</Text></Col>
                                                <Col span={4}><Text><strong>Quan hệ:</strong> {member.Relationship}</Text></Col>
                                                <Col span={4}><Text><strong>Ngày sinh:</strong> {member.DateOfBirth}</Text></Col>
                                                <Col span={4}><Text><strong>Giới tính:</strong> {member.Gender}</Text></Col>
                                                <Col span={4}><Text><strong>Số điện thoại:</strong> {member.PhoneNumber}</Text></Col>
                                            </Row>

                                            <hr />
                                        </div>
                                    ))
                                ) : (
                                    <Text>Không có thông tin thành viên gia đình.</Text>
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </Layout>
    );
};

export default EmployeeProfile;

