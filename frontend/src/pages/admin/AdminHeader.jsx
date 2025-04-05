import { Avatar, Badge, Dropdown, Flex, Typography, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import {
    BellOutlined,
    UserOutlined,
    SettingOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onLogout, imageUrl, unreadCount }) => {
    const [username, setUsername] = useState([]);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const { Text } = Typography;
    const navigate = useNavigate();
    const role = JSON.parse(localStorage.getItem('user')).role;

    useEffect(() => {
        if (token) {
            setUsername(JSON.parse(user).name);
        }
    }, []);

    const items = [
        {
            key: "userInfo",
            label: <Text strong>{username || "Người dùng"}</Text>,
            disabled: true,
        },
        role !== "Admin" && {
            key: "User/home",
            label: "Thông tin cá nhân",
            onClick: () => navigate("../User/home"),
        },
        {
            key: "logout",
            label: "Đăng xuất",
            onClick: onLogout,
        },
    ];

    return (
        <Flex align='center' justify='space-between'>
            <Typography.Title level={4} type='secondary'>
                
            </Typography.Title>

            <Flex align='center' gap='3rem' style={{ paddingBottom: '7px' }}>
                <Flex align='center' gap='10px'>
                    <HomeOutlined className='header-icon' onClick={() => navigate('/admin/home')} />

                    <Badge count={unreadCount} size='small'>
                        <BellOutlined className='header-icon' onClick={() => navigate('/admin/notifications')} />
                    </Badge>

                    {/* <SettingOutlined className='header-icon' /> */}

                    <Dropdown menu={{ items }} trigger={["click"]} className='avata'>
                        <a onClick={(e) => e.preventDefault()} style={{ margin: '-16px 0' }}>
                            <Space>
                                <Avatar src={imageUrl} icon={!user?.Avatar && <UserOutlined />} />
                            </Space>
                        </a>
                    </Dropdown>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default AdminHeader;