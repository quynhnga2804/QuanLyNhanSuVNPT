import React, { useState, useContext, useEffect } from 'react';
import { Button, Flex, Layout, Affix, message } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { UserContext } from './api/api.jsx';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import Sidebar from './pages/user/SidebarUser.jsx';
import HeaderUser from './pages/user/HeaderUser.jsx';
import HomeUser from './pages/user/HomeUser.jsx';
import EmployeeProfile from './pages/user/EmployeeProfile.jsx';
import NotificationListUser from './pages/user/NotificationListUser.jsx';
import GeneralInfo from './pages/user/GeneralInfo.jsx';
import ContractUser from './pages/user/ContractUser.jsx';
import { NotificationProvider } from './pages/user/NotificationContext';
import AttendanceUser from './pages/user/AttendanceUser.jsx';
import OvertimeUser from './pages/user/OvertimeUser.jsx';
import MonthlySalaryUser from './pages/user/MonthlySalaryUser.jsx';
import PolicyInfo from './pages/user/PolicyInfo.jsx';
import HRPolicy from './pages/admin/HRPolicy.jsx';
import BenifitPolicy from './pages/admin/BenifitPolicy.jsx';
import SalaryPolicy from './pages/admin/SalaryPolicy.jsx';
const { Sider, Content, Header } = Layout;

const AppUser = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [employeeinfo, setEmployeeInfo] = useState();
  const [monthlySalaryUser, setMonthlySalaryUser] = useState([]);
  const [contractUsers, setContractUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchEmployeeInfo();
      fetchMonthlySalaryUser();
      fetchContractUser();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
        navigate('/login');
    } 
}, []);

  const fetchEmployeeInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/employeeinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeInfo(response.data);
    } catch (error) {
      console.error('Lấy thông tin nhân viên thất bại!');
    }
  };

  const fetchMonthlySalaryUser = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/user/monthlysalaries', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setMonthlySalaryUser(response.data);
        console.log('lương: ', response.data);
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu lương: ", error);
        // message.error("Không lấy được dữ liệu lương!");
    }
  };

  const fetchContractUser = async () => {
    try {
        const contractResponse = await fetch("http://localhost:5000/api/user/contractinfo", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const contractData = await contractResponse.json();
        if (!contractResponse.ok) throw new Error(contractData.message);
        setContractUsers(contractData);
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu hợp đồng: ", error);
      // message.error("Không lấy được dữ liệu hợp đồng!");
  }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <NotificationProvider>
      <Layout className="userLayout" style={{ minHeight: '100vh' }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed} width={220} collapsedWidth={60} className="sider" >
          <Sidebar onLogout={handleLogout} collapsed={collapsed} />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="triger-btn"
          />
        </Sider>

        <Layout>
          {/* <Header className="header" >
            <HeaderUser employeeinfo={employeeinfo} />
          </Header> */}
          <Affix offsetTop={0} style={{ width: '100%', zIndex: 1000 }}>
    <Header className="header" style={{ background: '#ffffff', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
      <HeaderUser employeeinfo={employeeinfo} />
    </Header>
  </Affix>

          <Content className="content">
            <Flex gap="large">
              <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="/generalinfo" element={<GeneralInfo />}>
                  <Route path="profile" element={<EmployeeProfile employeeinfo={employeeinfo} contractUsers={contractUsers}/>} />
                  <Route path="contracts" element={<ContractUser contractUsers={contractUsers} />} />
                  <Route index element={<EmployeeProfile employeeinfo={employeeinfo} contractUsers={contractUsers} />} />
                </Route>
                <Route path="home" element={<HomeUser employeeinfo={employeeinfo} monthlySalaryUser={monthlySalaryUser} contractUsers={contractUsers}/>} />
                <Route path="notifications" element={<NotificationListUser />} />
                <Route path="generalinfo" element={<GeneralInfo />} />
                <Route path='attendances' element={<AttendanceUser/>} />
                <Route path='overtimes' element={<OvertimeUser employeeinfo={employeeinfo}/>} />
                <Route path='monthlysalaries' element={<MonthlySalaryUser monthlySalaryUser={monthlySalaryUser} />} />
                <Route path="/policyinfo" element={<PolicyInfo />}>
                  <Route path="salary-policy" element={<SalaryPolicy />} />
                  <Route path="benefit-policy" element={<BenifitPolicy />} />
                  <Route path="hr-policy" element={<HRPolicy />} />
                  <Route index element={<SalaryPolicy />} />
                </Route>
              </Routes>
            </Flex>
          </Content>
        </Layout>
      </Layout>
    </NotificationProvider>
  );
};

export default AppUser;
