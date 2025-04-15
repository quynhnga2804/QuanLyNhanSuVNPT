import React, { useState, useEffect, useContext } from "react";
import { Avatar, Badge, Flex, Affix, Dropdown, Menu } from "antd";
import { BellOutlined, UserOutlined, LogoutOutlined, LockOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import { NotificationContext } from "./NotificationContext";
import { ModalContext } from "../../api/ModalContext";
import axios from "axios";
import { UserContext } from "../../api/UserContext";

const HeaderUser = ({ employeeinfo }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const username = user?.name || "";
    const [imageUrl, setImageUrl] = useState(null);
    const {unreadCount} = useContext(NotificationContext);
    const {isChangePassVisible, setChangePassVisible, modalMessage, setModalMessage, isForcedChange, setIsForcedChange} = useContext(ModalContext);
    const role = user?.role.toLowerCase();
    const forceChange = localStorage.getItem("forceChangePass");

    const handleMenuClick = ({ key }) => {
        if (key === "profile") {
            navigate("/user/generalinfo/profile");
        } else if (key === "change-password") {
            setChangePassVisible(true);
        } else if (key === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    useEffect(() => {
        if (forceChange === 'true') {
          setModalMessage('Bạn cần đổi mật khẩu để tiếp tục!');
          setChangePassVisible(true);
          setIsForcedChange(true);      
          console.log("force:", isForcedChange);
        }
      }, []);

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
                    key: "profile",
                    icon: <UserOutlined />,
                    label: "Thông tin nhân viên",
                },
                role !== "employee" && {
                    key: "admin/home",
                    icon: <TeamOutlined />,
                    label: "Quản lý nhân sự",
                    onClick: () => navigate("../admin/home"),
                },
                {
                    key: "change-password",
                    icon: <LockOutlined />,
                    label: "Đổi mật khẩu",
                },
                { type: "divider" },
                {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Đăng xuất",
                    danger: true,
                },
            ]}
        />
    );

    return (
        <Affix offsetTop={0} style={{ width: '100%' }}>
            <Flex align="center" justify="end">
                <Flex align="center" gap="3rem" style={{ paddingBottom: '20px' }}>
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
                            <Avatar src={imageUrl} size={40} style={{ border: '2px solid #ddd', margin: '3px 0' }} />
                            <p style={{ margin: 0, lineHeight: "1" }}>{username || "TÀI KHOẢN"}</p>
                        </Flex>
                    </Dropdown>
                </Flex>
            </Flex>

            {/* Hiển thị modal đổi mật khẩu */}
            <ChangePasswordModal 
                visible={isChangePassVisible} 
                onClose={() => {if(!isForcedChange){
                    setChangePassVisible(false)
                }}}
                messageText={modalMessage} 
                isForce={isForcedChange}/>
        </Affix>
    );
};

export default HeaderUser;
