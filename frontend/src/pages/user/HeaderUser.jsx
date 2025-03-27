import React, { useState, useEffect, useContext } from "react";
import { Avatar, Badge, Flex, Affix, Dropdown, Menu } from "antd";
import { BellOutlined, UserOutlined, LogoutOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal"; 
import { NotificationContext } from "./NotificationContext";
import axios from "axios";

const HeaderUser = ({employeeinfo}) => {
    const navigate = useNavigate();
    const location = useLocation();
    // const { username } = location.state || {}; // Đề phòng undefined
    const [username, setUserName] = useState(localStorage.getItem("username") || "");
    const [isModalVisible, setModalVisible] = useState(false);
    // const [employeeinfo, setemployeeinfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const { unreadCount} = useContext(NotificationContext);

    const handleMenuClick = ({ key }) => {
        if (key === "profile") {
            navigate("/user/generalinfo/profile");
        } else if (key === "change-password") {
            setModalVisible(true); // Hiển thị modal đổi mật khẩu
        } else if (key === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
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
        // <div className="fixed-header">
            <Affix offsetTop={0} style={{ width: '100%' }}>
            <Flex align="center" justify="end">
                {/* <Typography.Title level={4} type="secondary"> </Typography.Title> */}

                <Flex align="center" gap="3rem" style={{ paddingBottom:'20px' }}>
                    <Flex align="center" gap="5px" onClick={() => navigate('/user/home')} style={{ cursor: 'pointer' }}>
                        <HomeOutlined className="header-icon" style={{ fontSize: '18px' }} />
                        <p style={{ margin: 0, lineHeight: '1' }}>Trang chủ</p>
                    </Flex>

                    <Flex align="center" gap="5px" onClick={() => navigate('/user/notifications')}>
                        <Badge count={unreadCount} size="small" offset={[5, -1]}>
                            <BellOutlined className="header-icon" style={{ fontSize: "18px" }} />
                        </Badge>
                        <p style={{ margin: 0, lineHeight: "1" }}>Thông báo</p>
                    </Flex>

                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Flex align="center" gap="5px" style={{ cursor: "pointer" }}>
                            <Avatar src={imageUrl} size={40} style={{ border: '2px solid #ddd', margin:'3px 0' }} />
                            <p style={{ margin: 0, lineHeight: "1" }}>{username || "TÀI KHOẢN"}</p>
                        </Flex>
                    </Dropdown>
                </Flex>
            </Flex>

            {/* Hiển thị modal đổi mật khẩu */}
            <ChangePasswordModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
            </Affix>
        // </div>
    );
};

export default HeaderUser;
