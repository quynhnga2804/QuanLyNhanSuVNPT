import { Flex, Image, Menu, Input, Avatar, Tooltip} from 'antd';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ClockCircleOutlined,
    FieldTimeOutlined,
    DollarOutlined,
    BookOutlined ,
    LogoutOutlined,
    UserOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';

const { Search } = Input;

const SidebarUser = ({collapsed}) => {
    const navigate = useNavigate(); 
    const location = useLocation();

    const selectedKey = location.pathname.split('/')[2] || 'generalinfo';

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } else {
            navigate(`/user/${e.key}`); 
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

            {/* {!collapsed ? (
                <Flex align='center' justify='center' style={{ padding: '10px 15px 0 15px', marginBottom:'1rem', }}>
                    <Search placeholder='Search...' allowClear />
                </Flex>
            ) : null} */}

            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                defaultSelectedKeys={['profile']}
                className="menu-bar"
                onClick={handleMenuClick}
                items={[
                    {
                        label: !collapsed ? 'Thông tin chung' : null,
                        key: 'generalinfo',
                        icon: <UserOutlined />,
                        title: 'Thông tin chung',
                    },
                    {
                        key: 'attendances',
                        icon: <ClockCircleOutlined />,
                        label: !collapsed ? 'Chấm công' : null,
                        title: 'Chấm công',
                    },
                    {
                        key: 'leaverequests',
                        icon: <CalendarOutlined />,
                        label: !collapsed ? 'Nghỉ phép' : null,
                        title: 'Nghỉ phép',
                    },
                    {
                        key: 'overtimes',
                        icon: <FieldTimeOutlined />,
                        label: !collapsed ? 'Tăng ca' : null,
                        title: 'Tăng ca',
                    },
                    {
                        key: 'monthlysalaries',
                        icon: <DollarOutlined />,
                        label: !collapsed ? 'Lương tháng' : null,
                        title: 'Lương tháng',
                    },
                    {
                        key: 'policyinfo',
                        icon: <BookOutlined />,
                        label: !collapsed ? 'Chính sách' : null,
                        title: 'Lương tháng',
                    },
                    {
                        key: 'logout',
                        label: !collapsed ? 'Đăng xuất' : null,
                        icon: <LogoutOutlined />,
                        danger: true,
                        title: 'Đăng xuất',
                    }
                ]}
            />
        </>
    );
};

export default SidebarUser;


