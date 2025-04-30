import React, { useState, useEffect, useContext } from 'react';
import { Button, Flex, Layout, message } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './App.css';
import Sidebar from './pages/admin/Sidebar';
import Employee from './pages/admin/Employee';
import PeriodicSalary from './pages/admin/PeriodicSalary';
import Contract from './pages/admin/Contract';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminHeader from './pages/admin/AdminHeader';
import OrganizationalStructure from './pages/admin/OrganizationalStructure';
import AdminHome from './pages/admin/AdminHome';
import HumanReport from './pages/admin/HumanReport';
import WorkRegulations from './pages/admin/WorkRegulations';
import HRPolicy from './pages/admin/HRPolicy';
import Attendance_Overtime from './pages/admin/Attendance_Overtime';
import HomeUser from './pages/user/HomeUser';
import Tax_Insurance from './pages/admin/Tax_Insurance';
import ProtectedRoute from '../src/api/ProtectedRoute';
import Notifications from './pages/admin/Notifications';
import Error404 from './components/Error404';
import { UserContext } from './api/UserContext';
import { get } from './api/apiService';

const { Sider, Header, Content } = Layout;

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeecontracts, setemployeecontracts] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user } = useContext(UserContext);
  const workEmail = user?.email;
  const imageUrl = `http://localhost:5000/uploads/${employees.find(emp => emp.WorkEmail === workEmail)?.Image || null}`;
  const [unreadCount, setUnreadCount] = useState(0);
  const [newEmployees, setnewEmployees] = useState([]);
  const [newContracts, setnewContracts] = useState([]);
  const [newDepartments, setnewDepartments] = useState([]);
  const [newDivisions, setnewDivisions] = useState([]);
  const role = user?.role.toLowerCase();

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchEmployeeContracts();
      fetchDivisions();
      fetchDepartments();
    } else {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Cập nhật mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (role === 'manager') {
      const dpID = employees.find(emp => emp.WorkEmail?.includes(workEmail))?.DepartmentID;
      const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
      const filterDivisions = divisions.filter(dv => dv.DivisionID === dvID);
      if (JSON.stringify(filterDivisions) !== JSON.stringify(divisions)) {
        setnewDivisions(filterDivisions);
      }
      const filterDepartments = departments.filter(dp => dp.DivisionID === dvID);
      if (JSON.stringify(filterDepartments) !== JSON.stringify(departments)) {
        setnewDepartments(filterDepartments);
      }
      const filternewEmployees = employees.filter(emp => filterDepartments.map(dp => dp.DepartmentID)?.includes(emp.DepartmentID));
      if (JSON.stringify(filternewEmployees) !== JSON.stringify(newEmployees)) {
        setnewEmployees(filternewEmployees);
      }
      const filterEmployeeContracts = employeecontracts.filter(emp => filternewEmployees.map(e => e.EmployeeID).includes(emp.EmployeeID));
      if (JSON.stringify(filterEmployeeContracts) !== JSON.stringify(newContracts)) {
        setnewContracts(filterEmployeeContracts);
      }
    }
  }, [role, employees, departments, employeecontracts, workEmail]);

  const dtEmployees = role === 'manager' ? newEmployees : employees;
  const dtDivisions = role === 'manager' ? newDivisions : divisions;
  const dtDepartments = role === 'manager' ? newDepartments : departments;
  const dtEmployeeContracts = role === 'manager' ? newContracts : employeecontracts;

  const fetchEmployees = async () => {
    try {
      const response = await get('/admin/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const url = '/admin/departments';
      const response = await get(url);
      setDepartments(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng ban:', error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await get('/admin/divisions');
      setDivisions(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng ban:', error);
    }
  };

  const fetchEmployeeContracts = async () => {
    try {
      const response = await get('/admin/employeecontracts');
      setemployeecontracts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hồ sơ nhân sự:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const resNoti = await get("/admin/notifications");
      const resUserNoti = await get("/admin/usernotifications");

      const notifications = resNoti.data;
      const usernotifications = resUserNoti.data;
      const employeesRes = await get("/admin/employees");

      const employees = employeesRes.data;
      const EmployeeID = employees.find(emp => emp.WorkEmail === workEmail)?.EmployeeID;

      const filteredNotifications = notifications.filter((item) =>
        (item.sentID === EmployeeID || item.receivedID === EmployeeID) &&
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
      console.log('Lỗi khi lấy số lượng thông báo:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('workEmail');
    localStorage.removeItem('activeKey');
    navigate('/', { replace: true });
  };

  return (
    <Layout className='adminLayout'>

      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} width={220} collapsedWidth={60} className='sider'>
        <Sidebar onLogout={handleLogout} collapsed={collapsed} imageUrl={imageUrl} />

        <Button type='text' icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} className='trigger-btn' />
      </Sider>

      <Layout>
        <Header className='header' style={{ marginBottom: '1px' }}>
          <AdminHeader onLogout={handleLogout} unreadCount={unreadCount} imageUrl={imageUrl} />
        </Header>

        <Content className='contents'>
          <Flex gap='large'>
            <Routes>
              <Route path='home' element={<ProtectedRoute element={<AdminHome dtEmployees={dtEmployees} dtDivisions={dtDivisions} dtEmployeeContracts={dtEmployeeContracts} dtDepartments={dtDepartments} />} allowedRoles={['admin', 'director', 'manager', 'accountant', 'hr']} />} />
              <Route path='User/home' element={<ProtectedRoute element={<HomeUser replace />} />} allowedRoles={['employee', 'director', 'manager', 'accountant']} />
              <Route path='employees' element={<ProtectedRoute element={<Employee fetchDepartments={fetchDepartments} departments={dtDepartments} employees={dtEmployees} fetchEmployees={fetchEmployees} />} allowedRoles={['admin', 'director', 'manager', 'hr', 'accountant']} />} />
              <Route path='contracts' element={<ProtectedRoute element={<Contract departments={dtDepartments} employees={dtEmployees} employeecontracts={dtEmployeeContracts} fetchEmployeeContracts={fetchEmployeeContracts} />} allowedRoles={['admin', 'director', 'manager', 'hr']} />} />
              <Route path='periodicsalaries' element={<ProtectedRoute element={<PeriodicSalary departments={dtDepartments} employees={dtEmployees} />} allowedRoles={['admin', 'director', 'accountant']} />} />
              <Route path='humanreports' element={<ProtectedRoute element={<HumanReport departments={dtDepartments} employees={dtEmployees} />} allowedRoles={['admin', 'director', 'manager']} />} />
              <Route path='organizationalstructures' element={<OrganizationalStructure employees={dtEmployees} />} />
              <Route path='attendance&overtime' element={<ProtectedRoute element={<Attendance_Overtime employees={dtEmployees} departments={dtDepartments} />} allowedRoles={['admin', 'director', 'manager', 'hr']} />} />
              <Route path='tax&insurance' element={<ProtectedRoute element={<Tax_Insurance />} allowedRoles={['admin', 'director']} />} />
              <Route path='workregulations' element={<WorkRegulations />} />
              <Route path='hrpolicies' element={<HRPolicy />} />
              <Route path='notifications' element={<Notifications fetchUnreadCount={fetchUnreadCount} employees={dtEmployees} />} />
              <Route path="/notfound" element={<Error404 />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;