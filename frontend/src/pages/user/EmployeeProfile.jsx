import React, { useEffect, useState } from "react";
import { Layout, Spin, message, Typography, Flex, Row, Col, Image, Form, Modal, Input, DatePicker, Select, Button } from "antd";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";

const { Header } = Layout;
const { Title, Text, Paragraph } = Typography;

const EmployeeProfile = ({ employeeinfo, contractUsers }) => {
    const [addForm] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [jobProfile, setJobProfile] = useState(null);
    const [resignation, setResignation] = useState(null);
    const [personalProfile, setPersonalProfile] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [managerList, setManagerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [showJobInfo, setShowJobInfo] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [showFamilyInfo, setShowFamilyInfo] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const firstContract = contractUsers.length > 0 ? contractUsers[0] : null;
    const today = new Date();
    const status = new Date(firstContract?.EndDate) < today ? 'Hết hạn' : 'Đang hoạt động';
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            // Gọi API lấy thông tin công việc
            const jobResponse = await axiosClient.get("/user/jobinfo", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const jobData = await jobResponse.data;
            // if (!jobResponse.ok) throw new Error(jobData.message);
            setJobProfile(jobData.jobProfile);
            setResignation(jobData.resignation);

            //Gọi API lấy manager
            const managerResponse = await axiosClient.get("/user/get-managers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const managerData = await managerResponse.data;
            if (!managerResponse.ok) throw new Error(managerData.message);
            setManagerList(managerData);

            // Gọi API lấy thông tin cá nhân
            const personalResponse = await axiosClient.get("/user/personalinfo", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const personalData = await personalResponse.data;
            setPersonalProfile(personalData);
            // Gọi API lấy thông tin thành viên gia đình
            const familyResponse = await axiosClient.get("/user/familymembers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const familyData = await familyResponse.data;
            setFamilyMembers(familyData);

        } catch (error) {
            // message.error(error.message);
            console.log("Lỗi: ", error.response?.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (employeeinfo?.Image) {
            const fetchImage = async () => {
                try {
                    const token = localStorage.getItem("token"); // Lấy token
                    const response = await axios.get(
                        `http://localhost:5000/uploads/${employeeinfo.Image}`,
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

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const handleEditCancel = () => {
        setIsDetailModalOpen(false);
    };

    const handleAddNew = () => {
        setIsAddModalOpen(true);
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields(); 
            const resignDate = dayjs(values.resignDate);
            const minimumResignDate = dayjs().add(15, 'day');

            if (resignDate.isBefore(minimumResignDate, 'day')) {
                message.warning('Ngày dự kiến nghỉ phải ít nhất sau 15 ngày kể từ hôm nay!');
                return;
            }

            Modal.confirm({
                title: 'Xác nhận gửi đơn',
                content: 'Bạn có chắc chắn muốn gửi đơn xin nghỉ việc không?',
                okText: 'Gửi',
                cancelText: 'Hủy',
                onOk: async () => {
                    try {
                        const newResign = {
                            EmployeeID: employeeinfo?.EmployeeID,
                            ManagerID: values.managerId,
                            Reason: values.reason,
                            ResignationsDate: resignDate,
                            Status: 'Pending',
                            CreatedAt: new Date(),
                        };

                        await axios.post('http://localhost:5000/api/user/req-resign', newResign, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        message.success('Tạo yêu cầu nghỉ việc thành công!');
                        handleAddCancel();
                        await fetchData();
                    } catch (error) {
                        console.error("Lỗi:", error?.response?.data || error.message);
                        message.error('Đã xảy ra lỗi tạo bản ghi nghỉ việc, vui lòng kiểm tra lại!');
                    }
                }
            });
        } catch (error) {
            console.log('Validate thất bại:', error);
        }
    };

    const translateStatus = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'pending':
                return 'Chờ duyệt';
            case 'approved':
                return 'Đã duyệt';
            case 'rejected':
                return 'Từ chối';
            default:
                return 'Không xác định';
        }
    };    

    const handleDetail = () => {
        detailForm.setFieldsValue({
            employeeName: employeeinfo?.FullName,
            reason: resignation?.Reason,
            resignDate: dayjs(resignation?.ResignationsDate),
            managerId: resignation?.ManagerID,
            status: translateStatus(resignation?.Status),
        });
    
        setIsDetailModalOpen(true);
    };

    return (
        <Layout className='employee-profile'>
            {loading ? (
                <Spin size="large" style={{ margin: 'auto' }} />
            ) : (
                <Flex vertical gap={20} style={{ width: '100%', padding: '20px' }}>
                    {/* Phần trên: Ảnh + Thông tin nhân viên */}
                    <Flex gap={20} style={{ width: '100%' }}>
                        <Flex vertical align="center" style={{ flex: 1 }}>
                            <Image src={imageUrl} style={{ border: '2px solid #ddd', }} />
                            <Title level={4} style={{ marginTop: '10px' }}>{employeeinfo?.FullName}</Title>
                            <Text> <strong>MÃ NV: {employeeinfo.EmployeeID}</strong></Text>
                        </Flex>

                        <Flex vertical style={{ flex: 2 }}>
                            <Header className='header-employee-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                                <Title level={3} className="header-ttnv">Thông tin nhân viên</Title>
                                <hr />
                            </Header>
                            <Flex className="sub-info-employeeinfo">
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    <Text><strong>SỐ ĐIỆN THOẠI:</strong> <span className="text">{employeeinfo?.PhoneNumber}</span></Text>
                                    <Text><strong>NGÀY SINH:</strong> <span className="text">{new Date(employeeinfo?.DateOfBirth).toLocaleDateString('vi-VN')}</span></Text>
                                    <Text><strong>GIỚI TÍNH:</strong> <span className="text">{employeeinfo?.Gender}</span></Text>
                                    <Text><strong>ĐỊA CHỈ:</strong> <span className="text">{employeeinfo?.Address}</span></Text>
                                    <Text><strong>EMAIL CÁ NHÂN:</strong> <span className="text">{employeeinfo?.PersonalEmail}</span></Text>
                                </Flex>
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    <Text><strong>EMAIL CÔNG VIỆC:</strong> <span className="text">{employeeinfo?.WorkEmail}</span></Text>
                                    <Text><strong>CHỨC DANH:</strong> <span className="text">{employeeinfo?.JobTitle}</span></Text>
                                    <Text><strong>CHỨC VỤ:</strong> <span className="text">{employeeinfo?.Position}</span></Text>
                                    <Text><strong>NGÀY BẮT ĐẦU:</strong> <span className="text">{new Date(employeeinfo?.StartDate).toLocaleDateString("vi-VN")}</span></Text>
                                    <Text><strong>PHÒNG BAN:</strong> <span className="text">{employeeinfo.Department ? employeeinfo.Department.DepartmentName : "Chưa có phòng ban"}</span></Text>
                                    <Text><strong>BỘ PHẬN: </strong> <span className="text">{employeeinfo.Department.Division ? employeeinfo.Department.Division.DivisionsName : "Chưa có bộ phận"}</span></Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Thông tin công việc */}
                    <Flex vertical className="container-employeeinfo-info">
                        <Header className='header-employeeinfo-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                            <Title level={3}
                                   onClick={() => setShowJobInfo(!showJobInfo)}
                                   style={{ cursor: 'pointer'}} >Thông tin công việc
                            </Title>
                            <hr />
                        </Header>
                        { showJobInfo && (
                            !jobProfile ? (
                                <Paragraph className="none-info"> Thông tin công việc chưa có! </Paragraph>
                              ) : (
                                <Flex className="sub-info-employeeinfo">
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    <Text><strong>TRẠNG THÁI NHÂN VIÊN:</strong> <span className="text">{jobProfile?.EmploymentStatus}</span></Text>
                                    <Text><strong>QUẢN LÝ TRỰC TIẾP:</strong></Text>
                                    <div style={{ padding: '0 0 0 2rem', lineHeight: '2.5rem' }}>
                                        {managerList.length > 0 ? (
                                            managerList.map((m) => (
                                                <Text key={m.EmployeeID}>
                                                    <span className="text">{m.FullName} ({m.Position})</span><br />
                                                </Text>
                                            ))
                                        ) : (
                                            <Text><span className="text">Chưa có</span></Text>
                                        )}
                                    </div>
                                    <Text><strong>SỐ GIỜ LÀM VIỆC TIÊU CHUẨN:</strong> <span className="text">{jobProfile?.StandardWorkingHours} giờ</span></Text>
                                </Flex>
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    <Text><strong>TRẠNG THÁI HỢP ĐỒNG:</strong> <span className="text">{status}</span></Text>
                                    <Text><strong>SỐ NGÀY NGHỈ PHÉP CÒN LẠI:</strong> <span className="text">{jobProfile?.RemainingLeaveDays} ngày</span></Text>
                                    <Text><strong>LIÊN HỆ KHẨN CẤP:</strong> <span className="text">{jobProfile?.EmergencyContactName} - {jobProfile?.EmergencyContactNumber}</span></Text>
                                </Flex>
                                <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                    {/* Chỉ hiển thị nếu resignation có giá trị */}
                                    {resignation && (resignation.Status === 'Approved') && (
                                        <>
                                            <Text><strong style={{color: 'red'}}>NGÀY NGHỈ VIỆC:</strong> <span className="text">{resignation.ResignationsDate}</span></Text>
                                            <Text><strong style={{color: 'red'}}>LÝ DO NGHỈ VIỆC:</strong> <span className="text">{resignation.Reason}</span></Text>
                                        </>
                                    )}
                                    <Text><strong>LƯƠNG CƠ BẢN:</strong> <span className="text">{new Intl.NumberFormat('vi-VN').format(jobProfile?.BaseSalary)} VNĐ</span></Text>
                                    <Text><strong>TRỢ CẤP:</strong> <span className="text">{new Intl.NumberFormat('vi-VN').format(jobProfile?.Allowance)} VNĐ</span></Text>
                                </Flex>
                            </Flex>
                              )
                        )}
                    </Flex>

                    {/* Thông tin cá nhân */}
                    <Flex vertical className="container-employeeinfo-info">
                        <Header className='header-employeeinfo-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                            <Title level={3}
                                   onClick={() => setShowPersonalInfo(!showPersonalInfo)} 
                                   style={{cursor: 'pointer'}} >Thông tin cá nhân</Title>
                            <hr />
                        </Header>
                        {showPersonalInfo && (
                            (!personalProfile || personalProfile.message || Object.values(personalProfile).every(val => val === null || val === "")) ? (
                                <Paragraph className="none-info"> Thông tin cá nhân chưa có! </Paragraph>
                              ) : (
                                <Flex className="sub-info-employeeinfo">
                                    <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                        <Text><strong>QUỐC TỊCH:</strong> <span className="text">{personalProfile?.Nationality || "Chưa có"}</span></Text>
                                        <Text><strong>NƠI SINH:</strong> <span className="text">{personalProfile?.PlaceOfBirth || "Chưa có"}</span></Text>
                                        <Text><strong>SỐ CCCD:</strong> <span className="text">{personalProfile?.ID_Card || "Chưa có"}</span></Text>
                                        <Text><strong>NƠI CẤP CCCD:</strong> <span className="text">{personalProfile?.ID_CardIssuedPlace || "Chưa có"}</span></Text>
                                    </Flex>
                                    <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                        <Text><strong>SỐ SỔ BẢO HIỂM:</strong> <span className="text">{personalProfile?.InsurancesNumber || "Chưa có"}</span></Text>
                                        <Text><strong>MÃ SỐ THUẾ:</strong> <span className="text">{personalProfile?.TaxCode || "Chưa có"}</span></Text>
                                        <Text><strong>TRÌNH ĐỘ HỌC VẤN:</strong> <span className="text">{personalProfile?.Education || "Chưa có"}</span></Text>
                                        <Text><strong>BẰNG CẤP:</strong> <span className="text">{personalProfile?.Degree || "Chưa có"}</span></Text>
                                    </Flex>
                                    <Flex vertical className="sub-info" gap={20} style={{ flex: 1 }}>
                                        <Text><strong>CHUYÊN NGÀNH:</strong> <span className="text">{personalProfile?.Major || "Chưa có"}</span></Text>
                                        <Text><strong>KINH NGHIỆM LÀM VIỆC:</strong> <span className="text">{personalProfile?.WorkExperience}</span></Text>
                                        <Text><strong>SỐ TÀI KHOẢN NGÂN HÀNG:</strong> <span className="text">{personalProfile?.BankAccount || "Chưa có"}</span></Text>
                                        <Text><strong>TÌNH TRẠNG HÔN NHÂN:</strong> <span className="text">{personalProfile?.MaritalStatus || "Chưa có"}</span></Text>
                                    </Flex>
                                </Flex>
                                )
                            )}
                    </Flex>

                    {/* Thông tin thành viên gia đình */}
                    <Flex vertical className="container-employeeinfo-info">
                        <Header className='header-employeeinfo-info' style={{ textAlign: 'left', background: 'none', padding: '0' }}>
                            <Title level={3}
                                   onClick={() => setShowFamilyInfo(!showFamilyInfo)}
                                   style={{ cursor: 'pointer'}} >Thông tin thành viên gia đình</Title>
                            <hr />
                        </Header>
                        {showFamilyInfo && (
                        <Flex className="sub-info-employeeinfo">
                            <Flex vertical className="sub-info" style={{ flex: 1 }}>
                                {familyMembers.length > 0 ? (
                                    familyMembers.map((member, index) => (
                                        <div key={index} >
                                            <Row gutter={16} style={{width: '100%', justifyContent: 'space-between'}}>
                                                <Col span={4}><Text><strong>TÊN:</strong> <span className="text">{member.FullName}</span></Text></Col>
                                                <Col span={4}><Text><strong>QUAN HỆ:</strong> <span className="text">{member.Relationship}</span></Text></Col>
                                                <Col span={4}><Text><strong>NGÀY SINH:</strong> <span className="text">{member.DateOfBirth}</span></Text></Col>
                                                <Col span={4}><Text><strong>GIỚI TÍNH:</strong> <span className="text">{member.Gender}</span></Text></Col>
                                                <Col span={4}><Text><strong>SỐ ĐIỆN THOẠI:</strong> <span className="text">{member.PhoneNumber}</span></Text></Col>
                                            </Row>
                                            <hr />
                                        </div>
                                    ))
                                ) : (
                                    <Text className="none-info">Không có thông tin thành viên gia đình.</Text>
                                )}
                            </Flex>
                        </Flex>
                        )}
                    </Flex>
                            
                    {/* Link text xin nghỉ việc */}
                    <Flex vertical className="container-employeeinfo-info">
                            <div style={{ textAlign: "right" }}>
                                {!resignation && (<Typography.Link onClick={handleAddNew}>
                                    <u>Xin nghỉ việc</u>
                                </Typography.Link>
                                )}
                                {resignation && (
                                    <Typography.Link onClick={handleDetail} style={{margin: ' 0 10px'}}>
                                        <u>Theo dõi thông tin xin nghỉ việc</u>
                                    </Typography.Link>
                                )}
                            </div>
                            <Modal
                                title={<div style={{ textAlign: 'center', width: '100%',  }}>Form xin nghỉ việc</div>}
                                open={isAddModalOpen}
                                onCancel={handleAddCancel}
                                onOk={handleAddSave}
                                okText="Gửi đơn"
                                cancelText="Hủy"
                            >
                                <Form form={addForm} layout="vertical">
                                    <Form.Item name="employeeId" hidden>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label='Tên nhân viên' name='employeeName' initialValue={employeeinfo?.FullName}  rules={[{ required: true }]} >
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item
                                        label="Lý do nghỉ việc"
                                        name="reason"
                                        rules={[{ required: true, message: 'Vui lòng nhập lý do nghỉ việc' }]}
                                    >
                                        <Input.TextArea rows={4} placeholder="Nhập lý do của bạn..." />
                                    </Form.Item>

                                    <Form.Item
                                        label="Ngày dự kiến nghỉ"
                                        name="resignDate"
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày dự kiến nghỉ' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label='Manager' name='managerId' rules={[{ required: true, message: 'Vui lòng chọn người quản lý' }]}>
                                        <Select placeholder="Chọn người quản lý" onChange={(value) => {
                                            const selectedManager = managerList.find((m) => m.EmployeeID === value);
                                            addForm.setFieldsValue({ managerName: selectedManager?.FullName });
                                        }}>
                                            {managerList.map((mng) => (
                                                <Option key={mng.EmployeeID} value={mng.EmployeeID}>
                                                    {mng.FullName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label='Trạng thái' name='status' initialValue={'Chờ duyệt'} rules={[{ required: true }]} >
                                        <Input disabled />
                                    </Form.Item>
                                </Form>
                            </Modal>

                            <Modal
                                title={<div style={{ textAlign: 'center', width: '100%',  }}>Thông tin xin nghỉ việc</div>}
                                open={isDetailModalOpen}
                                onCancel={handleEditCancel}
                                footer={null}
                                cancelText="Đóng">
                                <Form form={detailForm} layout="vertical">
                                    <Form.Item name="employeeName" label="Tên nhân viên">
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item label="Lý do nghỉ việc" name="reason">
                                        <Input.TextArea rows={4} disabled/>
                                    </Form.Item>
                                    <Form.Item label="Ngày dự kiến nghỉ" name="resignDate">
                                        <DatePicker style={{ width: '100%' }} disabled />
                                    </Form.Item>
                                    <Form.Item label="Manager" name="managerId">
                                        <Select disabled>
                                            {managerList.map((mng) => (
                                                <Option key={mng.EmployeeID} value={mng.EmployeeID}>
                                                    {mng.FullName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="status" label="Trạng thái">
                                        <Input disabled />
                                    </Form.Item>
                                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                                        <Button type="primary" onClick={handleEditCancel}>
                                            Đóng
                                        </Button>
                                    </div>
                                </Form>
                                
                            </Modal>
                    </Flex>
                </Flex>
            )}
        </Layout>
    );
};

export default EmployeeProfile;

