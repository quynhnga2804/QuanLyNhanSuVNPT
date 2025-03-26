import { Flex, Image, Menu, Input, Avatar } from 'antd';
// import Search from 'antd/es/transfer/search';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    TeamOutlined,
    ProfileOutlined,
    ContactsOutlined,
    ClockCircleOutlined,
    FieldTimeOutlined,
    CalendarOutlined,
    DollarOutlined,
    FileTextOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';

const { Search } = Input;

const SidebarUser = ({collapsed}) => {
    const navigate = useNavigate(); // Hook điều hướng

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
        } else {
            navigate(`/user/${e.key}`); // Điều hướng đến trang tương ứng
        }
    };

    return (
        <>
            <Flex align='center' justify='center' style={{ padding: collapsed ? '10px' : '10px 0' }}>
                <div className="logo">
                    <Flex onClick={() => navigate("/user/home")} style={{ cursor: 'pointer' }}>
                        <Avatar src={logo} size={45} style={{objectFit:'cover' }} />
                    </Flex>
                </div>
            </Flex>

            {!collapsed ? (
                <Flex align='center' justify='center' style={{ padding: '10px 15px 0 15px', marginBottom:'1rem', }}>
                    <Search placeholder='Search...' allowClear />
                </Flex>
            ) : null}


            <Menu
                mode="inline"
                defaultSelectedKeys={['profile']}
                className="menu-bar"
                onClick={handleMenuClick}
                items={[
                    {
                        label: !collapsed ? 'Thông tin chung' : null,
                        key: 'profile',
                        icon: <TeamOutlined />,
                        // children: [
                        //     {
                        //         key: 'profile',
                        //         icon: <ProfileOutlined />,
                        //         label: 'Thông tin nhân viên',
                        //     },
                        //     {
                        //         key: 'work-info',
                        //         icon: <ProfileOutlined />,
                        //         label: 'Thông tin công việc',
                        //     },
                        //     {
                        //         key: 'personal-info',
                        //         icon: <ContactsOutlined />,
                        //         label: 'Thông tin cá nhân',
                        //     }
                        // ]
                    },
                    {
                        key: 'attendance',
                        icon: <ClockCircleOutlined />,
                        label: !collapsed ? 'Chấm công' : null,
                    },
                    {
                        key: 'overtime',
                        icon: <FieldTimeOutlined />,
                        label: !collapsed ? 'OverTime' : null,
                    },
                    {
                        key: 'leave',
                        icon: <CalendarOutlined />,
                        label: !collapsed ? 'Nghỉ phép' : null,
                    },
                    {
                        key: 'salary',
                        icon: <DollarOutlined />,
                        label: !collapsed ? 'Lương tháng' : null,
                    },
                    {
                        key: 'contracts',
                        icon: <FileTextOutlined />,
                        label: !collapsed ? 'Hợp đồng lao động' : null,
                    },
                    {
                        key: 'logout',
                        label: !collapsed ? 'Đăng xuất' : null,
                        icon: <LogoutOutlined />,
                        danger: true,
                    }
                ]}
            />
        </>
    );
};

export default SidebarUser;


