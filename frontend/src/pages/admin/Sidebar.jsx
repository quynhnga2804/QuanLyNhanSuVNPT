import { Flex, Menu, Avatar, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { TeamOutlined, ReconciliationOutlined, WalletOutlined, DollarOutlined, CarryOutOutlined, ClusterOutlined, SolutionOutlined, ReadOutlined, DiffOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, onLogout, imageUrl }) => {
    const [activeKey, setActiveKey] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role;

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    const selectedKey = location.pathname.replace('/admin/', '') || 'employees';

    const getItem = (key, icon, label) => (
        <Menu.Item key={key} icon={
            collapsed ? (
                <Tooltip title={label} placement="right">
                    <span>{icon}</span>
                </Tooltip>
            ) : icon
        }>
            {!collapsed && label}
        </Menu.Item>
    );

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            navigate('/');
        } else {
            navigate(`/admin/${e.key}`);
        }
    };

    return (
        <>
            <Flex align='center' justify='center' style={{ padding: collapsed ? '10px' : '10px 0' }}>
                <div className="logo">
                    <Avatar src={logo} size={46} onClick={() => navigate('/admin/home')} />
                </div>
            </Flex>
            {!collapsed && (
                <Flex align='center' justify='center' style={{ padding: '5px 0', margin: '5px 20px', color: 'rgb(0, 96, 169)', fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 'bold' }}>
                    Xin chào {role}!
                </Flex>
            )}

            <Menu mode='inline' selectedKeys={[selectedKey]} defaultOpenKeys={['sub1']} activeKey={activeKey} onChange={setActiveKey} onClick={handleMenuClick} className='menu-bar'>
                <Menu.ItemGroup style={{ margin: '0 10px' }} key="base" title={!collapsed ? 'Quản lý chung' : null}>
                    {role !== 'Accountant' ? getItem('employees', <TeamOutlined onClick={() => setActiveKey('1')} />, 'Danh sách nhân sự') : null}
                    {role !== 'Accountant' ? getItem('contracts', <CarryOutOutlined onClick={() => setActiveKey('1')} />, 'Hợp đồng lao động') : null}
                    {getItem('periodicsalaries', <DollarOutlined onClick={() => setActiveKey('1')} />, 'Bảng lương định kỳ')}
                    {getItem('humanreports', <ReconciliationOutlined onClick={() => setActiveKey('1')} />, 'Báo cáo')}
                </Menu.ItemGroup>

                <Menu.ItemGroup style={{ margin: '0 10px' }} key="org" title={!collapsed ? 'Thiết kế tổ chức' : null}>
                    {role !== 'Accountant' ? getItem('organizationalstructures', <ClusterOutlined onClick={() => setActiveKey('1')} />, 'Cơ cấu tổ chức') : null}
                    {getItem('attendance&overtime', <SolutionOutlined onClick={() => setActiveKey('1')} />, 'Công thời')}
                    {role === 'Admin' ? getItem('tax&insurance', <DiffOutlined onClick={() => setActiveKey('1')} />, 'Thuế và bảo hiểm') : null}
                </Menu.ItemGroup>

                <Menu.ItemGroup style={{ margin: '0 10px' }} key="policy" title={!collapsed ? 'Quy định & Chính sách' : null}>
                    {getItem('workregulations', <ReadOutlined onClick={() => setActiveKey('1')} />, 'Quy định làm việc')}
                    {getItem('hrpolicies', <WalletOutlined onClick={() => setActiveKey('1')} />, 'Chính sách nhân sự')}
                </Menu.ItemGroup>

                <Menu.Item key="logout" icon={collapsed ? (<Tooltip title="Đăng xuất" placement="right"><span><LogoutOutlined /></span></Tooltip>) : <LogoutOutlined />} onClick={onLogout}>
                    {!collapsed && 'Đăng xuất'}
                </Menu.Item>
            </Menu>
        </>
    );
};

export default Sidebar;