import { Flex, Menu, Avatar, Tooltip } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { TeamOutlined, ReconciliationOutlined, WalletOutlined, DollarOutlined, CarryOutOutlined, ClusterOutlined, SolutionOutlined, ReadOutlined, DiffOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../api/UserContext';

const Sidebar = ({ collapsed, onLogout }) => {
    const [activeKey, setActiveKey] = useState('1');
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    const selectedKey = location.pathname.replace('/admin/', '') || 'employees';

    const getItem = (key, icon, label) => (
        <Menu.Item key={key} icon={
            collapsed ? (
                <Tooltip title={label} placement="right">
                    <span onClick={() => setActiveKey('1')}>{icon}</span>
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
                    {getItem('employees', <TeamOutlined />, 'Danh sách nhân sự')}
                    {role !== 'accountant' ? getItem('contracts', <CarryOutOutlined />, 'Hợp đồng lao động') : null}
                    {role === 'accountant' ? getItem('periodicsalaries', <DollarOutlined />, 'Bảng lương định kỳ') : null}
                    {(role === 'manager' || role === 'hr') ? getItem('humanreports', <ReconciliationOutlined />, 'Báo cáo') : null}
                </Menu.ItemGroup>

                <Menu.ItemGroup style={{ margin: '0 10px' }} key="org" title={!collapsed ? 'Thiết kế tổ chức' : null}>
                    {role !== 'accountant' ? getItem('organizationalstructures', <ClusterOutlined />, 'Cơ cấu tổ chức') : null}
                    {(role === 'hr' || role === 'director' || role === 'manager') ? getItem('attendance&overtime', <SolutionOutlined />, 'Công thời') : null}
                    {role === 'admin' ? getItem('tax&insurance', <DiffOutlined />, 'Thuế và bảo hiểm') : null}
                </Menu.ItemGroup>

                <Menu.ItemGroup style={{ margin: '0 10px' }} key="policy" title={!collapsed ? 'Quy định & Chính sách' : null}>
                    {getItem('workregulations', <ReadOutlined />, 'Quy định làm việc')}
                    {getItem('hrpolicies', <WalletOutlined />, 'Chính sách nhân sự')}
                </Menu.ItemGroup>

                <Menu.Item key="logout" icon={collapsed ? (<Tooltip title="Đăng xuất" placement="right"><span><LogoutOutlined /></span></Tooltip>) : <LogoutOutlined />} onClick={onLogout}>
                    {!collapsed && 'Đăng xuất'}
                </Menu.Item>
            </Menu>
        </>
    );
};

export default Sidebar;