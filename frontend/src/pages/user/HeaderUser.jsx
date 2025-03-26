// // import { Avatar, Badge, Flex, Typography, Dropdown, Menu } from 'antd';
// // import { HomeOutlined, BellOutlined, UserOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // const HeaderUser = () => {
// //     const navigate = useNavigate();
// //     const [username, setUserName] = useState("");

// //     useEffect(() => {
// //         const savedUserName = localStorage.getItem('username'); 
// //         if (savedUserName) {
// //             setUserName(savedUserName);
// //         }
// //     }, []);

// //     const handleMenuClick = ({ key }) => {
// //         if (key === 'profile') {
// //             navigate('/user/profile');
// //         } else if (key === 'change-password') {
// //             navigate('/user/change-password');
// //         } else if (key === 'logout') {
// //             localStorage.removeItem('token');
// //             localStorage.removeItem('user');
// //             navigate('/login');
// //         }
// //     };

// //     const menu = (
// //         <Menu onClick={handleMenuClick}>
// //             <Menu.Item key="profile" icon={<UserOutlined />}>
// //                 Thông tin nhân viên
// //             </Menu.Item>
// //             <Menu.Item key="change-password" icon={<LockOutlined />}>
// //                 Đổi mật khẩu
// //             </Menu.Item>
// //             <Menu.Divider />
// //             <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
// //                 Đăng xuất
// //             </Menu.Item>
// //         </Menu>
// //     );

// //     return (
// //         <div className="fixed-header">
// //             <Flex align="center" justify="space-between">
// //                 <Typography.Title level={4} type="secondary">
// //                     {/* Hihi */}
// //                 </Typography.Title>

// //                 <Flex align="center" gap="3rem" style={{ paddingBottom: '7px' }}>
// //                     <Flex align="center" gap="5px" onClick={() => navigate('/user/profile')} style={{ cursor: 'pointer' }}>
// //                         <HomeOutlined className="header-icon" style={{ fontSize: '18px' }} />
// //                         <p style={{ margin: 0, lineHeight: '1' }}>Trang chủ</p>
// //                     </Flex>

// //                     <Flex align="center" gap="5px">
// //                         <Badge count={6} size="small" offset={[5, -1]}>
// //                             <BellOutlined className="header-icon" style={{ fontSize: '18px' }} />
// //                         </Badge>
// //                         <p style={{ margin: 0, lineHeight: '1' }}>Thông báo</p>
// //                     </Flex>

// //                     <Dropdown overlay={menu} trigger={['click']}>
// //                         <Flex align="center" gap="5px" style={{ cursor: 'pointer' }}>
// //                             <Avatar icon={<UserOutlined />} style={{ verticalAlign: 'middle' }} />
// //                             <p style={{ margin: 0, lineHeight: '1' }}>{username || "TÀI KHOẢN"}</p>
// //                         </Flex>
// //                     </Dropdown>
// //                 </Flex>
// //             </Flex>
// //         </div>
// //     );
// // };

// // export default HeaderUser;

// import { Avatar, Badge, Flex, Typography, Dropdown, Menu, Modal, Input, Button, Form, message } from 'antd';
// import { HomeOutlined, BellOutlined, UserOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const HeaderUser = () => {
//     const navigate = useNavigate();
//     const [username, setUserName] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isOtpStep, setIsOtpStep] = useState(false);
//     const [otpCountdown, setOtpCountdown] = useState(60);
//     const [otpSent, setOtpSent] = useState(false);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         const savedUserName = localStorage.getItem('username'); 
//         if (savedUserName) {
//             setUserName(savedUserName);
//         }
//     }, []);

//     useEffect(() => {
//         let timer;
//         if (otpSent && otpCountdown > 0) {
//             timer = setInterval(() => {
//                 setOtpCountdown((prev) => prev - 1);
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [otpSent, otpCountdown]);

//     const handleMenuClick = ({ key }) => {
//         if (key === 'profile') {
//             navigate('/user/profile');
//         } else if (key === 'change-password') {
//             setIsModalOpen(true);
//         } else if (key === 'logout') {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             navigate('/login');
//         }
//     };

//     const handlePasswordSubmit = (values) => {
//         console.log("Password Change Request:", values);
//         setIsOtpStep(true);
//         setOtpCountdown(60);
//         setOtpSent(true);
//         message.success("OTP đã được gửi về số điện thoại của bạn");
//     };

//     const handleOtpSubmit = (values) => {
//         console.log("OTP Submitted:", values.otp);
//         message.success("Mật khẩu đã được thay đổi thành công");
//         setIsModalOpen(false);
//         setIsOtpStep(false);
//         form.resetFields();
//     };

//     const menu = (
//         <Menu onClick={handleMenuClick}>
//             <Menu.Item key="profile" icon={<UserOutlined />}>
//                 Thông tin nhân viên
//             </Menu.Item>
//             <Menu.Item key="change-password" icon={<LockOutlined />}>
//                 Đổi mật khẩu
//             </Menu.Item>
//             <Menu.Divider />
//             <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
//                 Đăng xuất
//             </Menu.Item>
//         </Menu>
//     );

//     return (
//         <div className="fixed-header">
//             <Flex align="center" justify="space-between">
//                 <Typography.Title level={4} type="secondary" />

                // <Flex align="center" gap="3rem" style={{ paddingBottom: '7px' }}>
                //     <Flex align="center" gap="5px" onClick={() => navigate('/user/profile')} style={{ cursor: 'pointer' }}>
                //         <HomeOutlined className="header-icon" style={{ fontSize: '18px' }} />
                //         <p style={{ margin: 0, lineHeight: '1' }}>Trang chủ</p>
                //     </Flex>

//                     <Flex align="center" gap="5px">
//                         <Badge count={6} size="small" offset={[5, -1]}>
//                             <BellOutlined className="header-icon" style={{ fontSize: '18px' }} />
//                         </Badge>
//                         <p style={{ margin: 0, lineHeight: '1' }}>Thông báo</p>
//                     </Flex>

//                     <Dropdown overlay={menu} trigger={['click']}>
//                         <Flex align="center" gap="5px" style={{ cursor: 'pointer' }}>
//                             <Avatar icon={<UserOutlined />} style={{ verticalAlign: 'middle' }} />
//                             <p style={{ margin: 0, lineHeight: '1' }}>{username || "TÀI KHOẢN"}</p>
//                         </Flex>
//                     </Dropdown>
//                 </Flex>
//             </Flex>

//             <Modal
//                 title={!isOtpStep ? "Đổi mật khẩu" : "Xác nhận OTP"}
//                 open={isModalOpen}
//                 onCancel={() => setIsModalOpen(false)}
//                 footer={null}
//             >
//                 {!isOtpStep ? (
//                     <Form form={form} onFinish={handlePasswordSubmit} layout="vertical">
//                         <Form.Item name="oldPassword" label="Mật khẩu cũ" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}> 
//                             <Input.Password />
//                         </Form.Item>
//                         <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}> 
//                             <Input.Password />
//                         </Form.Item>
//                         <Form.Item name="confirmPassword" label="Nhập lại mật khẩu mới" rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu mới!' }]}> 
//                             <Input.Password />
//                         </Form.Item>
//                         <Button type="primary" htmlType="submit" block>
//                             Xác nhận
//                         </Button>
//                     </Form>
//                 ) : (
//                     <Form form={form} onFinish={handleOtpSubmit} layout="vertical">
//                         <Form.Item name="otp" label="Nhập OTP" rules={[{ required: true, message: 'Vui lòng nhập OTP!' }]}> 
//                             <Input maxLength={6} />
//                         </Form.Item>
//                         <Button type="primary" htmlType="submit" block>
//                             Xác nhận OTP
//                         </Button>
//                         <Button type="link" disabled={otpCountdown > 0} onClick={() => setOtpCountdown(60)}>
//                             Gửi lại OTP {otpCountdown > 0 ? `(${otpCountdown}s)` : ""}
//                         </Button>
//                     </Form>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default HeaderUser;

import React, { useState, useEffect } from "react";
import { Avatar, Badge, Flex, Typography, Dropdown, Menu } from "antd";
import { BellOutlined, UserOutlined, LogoutOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal"; // Import modal đổi mật khẩu
import axios from "axios";

const HeaderUser = () => {
    const navigate = useNavigate();
    const [username, setUserName] = useState(localStorage.getItem("username") || "");
    const [isModalVisible, setModalVisible] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    const handleMenuClick = ({ key }) => {
        if (key === "profile") {
            navigate("/user/profile");
        } else if (key === "change-password") {
            setModalVisible(true); // Hiển thị modal đổi mật khẩu
        } else if (key === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

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


    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    key: "profile", icon: <UserOutlined />,
                    label: "Thông tin nhân viên",
                },
                {
                    key: "change-password", icon: <LockOutlined />,
                    label: "Đổi mật khẩu",
                },
                { type: "divider" }, // Thay cho <Menu.Divider />
                {
                    key: "logout", icon: <LogoutOutlined />,
                    label: "Đăng xuất",
                    danger: true,
                },
            ]}
        />

    );

    return (
        <div className="fixed-header">
            <Flex align="center" justify="space-between">
                <Typography.Title level={4} type="secondary"> </Typography.Title>

                <Flex align="center" gap="3rem" style={{ paddingBottom:'20px' }}>
                    <Flex align="center" gap="5px" onClick={() => navigate('/user/home')} style={{ cursor: 'pointer' }}>
                        <HomeOutlined className="header-icon" style={{ fontSize: '18px' }} />
                        <p style={{ margin: 0, lineHeight: '1' }}>Trang chủ</p>
                    </Flex>

                    <Flex align="center" gap="5px">
                        <Badge count={6} size="small" offset={[5, -1]}>
                            <BellOutlined className="header-icon" style={{ fontSize: "18px" }} />
                        </Badge>
                        <p style={{ margin: 0, lineHeight: "1" }}>Thông báo</p>
                    </Flex>

                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Flex align="center" gap="5px" style={{ cursor: "pointer" }}>
                            {/* <Avatar icon={<UserOutlined />} /> */}
                            <Avatar src={imageUrl} size={40} style={{ border: '2px solid #ddd', margin:'-25px 0' }} />
                            <p style={{ margin: 0, lineHeight: "1" }}>{username || "TÀI KHOẢN"}</p>
                        </Flex>
                    </Dropdown>
                </Flex>
            </Flex>

            {/* Hiển thị modal đổi mật khẩu */}
            <ChangePasswordModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
        </div>
    );
};

export default HeaderUser;
