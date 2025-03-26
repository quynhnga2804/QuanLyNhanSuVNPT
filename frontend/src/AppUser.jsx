import React, { useState, useContext } from 'react';
import { Button, Flex, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { UserContext } from './api/api.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';

import './App.css';
import Sidebar from './pages/user/SidebarUser.jsx';
import HeaderUser from './pages/user/HeaderUser.jsx';
import HomeUser from './pages/user/HomeUser.jsx';
import EmployeeProfile from './pages/user/EmployeeProfile.jsx';

const { Sider, Content, Header } = Layout;

const AppUser = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <Layout className='userLayout' style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        collapsedWidth={60}
        className="sider"
      >
        <Sidebar onLogout={handleLogout} />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="triger-btn"
        />
      </Sider>

      <Layout>
        <Header className="header">
          <HeaderUser />
        </Header>

        <Content className="content" >
          <Flex gap="large">
            <Routes>
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="home" element={<HomeUser />} />
            </Routes>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppUser;
