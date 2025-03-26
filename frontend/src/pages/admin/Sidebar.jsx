import { Flex, Menu, Input, Avatar, Tooltip } from 'antd';
import React from 'react';
import {
    TeamOutlined,
    ReconciliationOutlined,
    WalletOutlined,
    AccountBookOutlined,
    CarryOutOutlined,
    ClusterOutlined,
    SolutionOutlined,
    FileTextOutlined,
    ReadOutlined,
    ScheduleOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const { Search } = Input;

const Sidebar = ({ collapsed, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

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
                <Flex align='center' justify='center' style={{ padding: '10px 15px 0 15px' }}>
                    <Search placeholder='Search...' allowClear />
                </Flex>
            )}

            <Menu
                mode='inline'
                selectedKeys={[selectedKey]}
                defaultOpenKeys={['sub1']}
                onClick={ handleMenuClick }
                className='menu-bar'
            >
                <Menu.ItemGroup style={{ margin: '0 10px' }} key="base" title={!collapsed ? 'Base.vn' : null}>
                    {getItem('employees', <TeamOutlined />, 'Danh sách nhân sự')}
                    {getItem('contracts', <CarryOutOutlined />, 'Hợp đồng lao động')}
                    {getItem('periodicsalaries', <AccountBookOutlined />, 'Bảng lương định kỳ')}
                    {getItem('humanreports', <ReconciliationOutlined />, 'Báo cáo nhân sự')}
                </Menu.ItemGroup>

                <Menu.ItemGroup style={{ margin: '0 10px' }} key="org" title={!collapsed ? 'Thiết kế tổ chức' : null}>
                    {getItem('organizationalstructures', <ClusterOutlined />, 'Cơ cấu tổ chức')}
                    {getItem('attendances', <SolutionOutlined />, 'Chấm công')}
                    {getItem('8', <ScheduleOutlined />, 'Nghiệp vụ được giao')}
                    {getItem('9', <FileTextOutlined />, 'Văn bản nhân sự')}
                </Menu.ItemGroup>

                <Menu.ItemGroup style={{ margin: '0 10px' }} key="policy" title={!collapsed ? 'Quy định & Chính sách' : null}>
                    {getItem('workregulations', <ReadOutlined />, 'Quy định làm việc')}
                    {getItem('hrpolicies', <WalletOutlined />, 'Chính sách nhân sự')}
                </Menu.ItemGroup>

                <Menu.Item key="logout" icon={
                    collapsed ? (
                        <Tooltip title="Đăng xuất" placement="right">
                            <span><LogoutOutlined /></span>
                        </Tooltip>
                    ) : <LogoutOutlined />
                } onClick={onLogout}>
                    {!collapsed && 'Đăng xuất'}
                </Menu.Item>
            </Menu>
        </>
    );
};

export default Sidebar;
