import React, { useState, useEffect } from 'react';
import { Button, Flex, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';
import Sidebar from './pages/admin/Sidebar';
import EmployeeList from './pages/admin/EmployeeList';
import PeriodicSalary from './pages/admin/PeriodicSalary';
import Contract from './pages/admin/Contract';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminHeader from './pages/admin/AdminHeader';
import OrganizationalStructure from './pages/admin/OrganizationalStructure';
import AdminHome from './pages/admin/AdminHome';
import HumanReport from './pages/admin/HumanReport';
import WorkRegulations from './pages/admin/WorkRegulations';
import HRPolicy from './pages/admin/HRPolicy';
import Attendance from './pages/admin/Attendance';
import Notification from './pages/admin/Notification';

const { Sider, Header, Content } = Layout;

const App = () => {
  const [newtoken, setToken] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeecontracts, setemployeecontracts] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const workEmail = user?.email;
  const imageUrl = `http://localhost:5000/uploads/${employees.find(emp => emp.WorkEmail === workEmail)?.Image ?? null}`;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) {
      setToken(token);
      fetchEmployees(token);
      fetchEmployeeContracts(token);
    } else {
      window.location.href = '/';
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Cập nhật mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/employees', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

  const fetchEmployeeContracts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/employeecontracts', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setemployeecontracts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hồ sơ nhân sự:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const resNoti = await axios.get("http://localhost:5000/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const resUserNoti = await axios.get("http://localhost:5000/api/admin/usernotifications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const notifications = resNoti.data;
      const usernotifications = resUserNoti.data;
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const workEmail = currentUser?.email;
      const employeesRes = await axios.get("http://localhost:5000/api/admin/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const employees = employeesRes.data;
      const EmployeeID = employees.find(emp => emp.WorkEmail === workEmail)?.EmployeeID;

      const filteredNotifications = notifications.filter((item) =>
        (item.sentID === EmployeeID || item.receivedID === EmployeeID || (item.sentID !== EmployeeID && item.receivedID === 'All')) &&
        !usernotifications.some((userNo) =>
          userNo.NotificationID === item.NotificationID &&
          userNo.EmployeeID === EmployeeID &&
          userNo.IsDeleted === 1)
      );

      const unreadCount = filteredNotifications.filter(item =>
        !usernotifications.some(userNo =>
          userNo.NotificationID === item.NotificationID &&
          userNo.EmployeeID === EmployeeID &&
          userNo.IsRead === 1)
      ).length;

      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng thông báo:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('workEmail');
    localStorage.removeItem('activeKey');
    localStorage.removeItem('username');
    // localStorage.Clear();
    setToken(null);
    navigate('/', { replace: true });
  };

  return (
    <Layout className='adminLayout'>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} width={220} collapsedWidth={60} className='sider'>
        <Sidebar onLogout={handleLogout} collapsed={collapsed} />

        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className='trigger-btn'
        />
      </Sider>

      <Layout>
        <Header className='header'>
          <AdminHeader onLogout={handleLogout} unreadCount={unreadCount} imageUrl={imageUrl} />
        </Header>

        <Content className='contents'>
          <Flex gap='large'>
            <Routes>
              <Route path='home' element={<AdminHome employees={employees} employeecontracts={employeecontracts} />} />
              <Route path='employees' element={<EmployeeList employees={employees} fetchEmployees={fetchEmployees} />} />
              <Route path='contracts' element={<Contract employeecontracts={employeecontracts} fetchEmployeeContracts={fetchEmployeeContracts} />} />
              <Route path='periodicsalaries' element={<PeriodicSalary />} />
              <Route path='humanreports' element={<HumanReport />} />
              <Route path='organizationalstructures' element={<OrganizationalStructure />} />
              <Route path='attendances' element={<Attendance />} />
              <Route path='workregulations' element={<WorkRegulations />} />
              <Route path='hrpolicies' element={<HRPolicy />} />
              <Route path='notifications' element={<Notification fetchUnreadCount={fetchUnreadCount} />} />
            </Routes>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;