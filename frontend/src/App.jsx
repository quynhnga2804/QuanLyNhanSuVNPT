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
import HumanReport from './pages/admin/Report';
import WorkRegulations from './pages/admin/WorkRegulations';
import HRPolicy from './pages/admin/HRPolicy';
import Attendance from './pages/admin/Attendance';
import Notification from './pages/admin/Notification';
import General from './pages/admin/General';
import Benefit_Salary from './pages/admin/Benefit_Salary';
import DependentList from './pages/admin/DependentList';
import LaborContract from './pages/admin/LaborContract';
import ReginationList from './pages/admin/ResignationList';
import PayrollCycle from './pages/admin/PayrollCycle';
import SalaryPolicy from './pages/admin/SalaryPolicy';
import BenefitPolicy from './pages/admin/BenifitPolicy';
import HRStatisticsReports from './pages/admin/HRStatisticsReports';
import HRAnalysisChart from './pages/admin/HRAnalysisChart';
import JobProfile from './pages/admin/JobProfile';
import HomeUser from './pages/user/HomeUser';

const { Sider, Header, Content } = Layout;

const App = () => {
  const [newtoken, setToken] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeecontracts, setemployeecontracts] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const workEmail = user?.email;
  const imageUrl = `http://localhost:5000/uploads/${employees.find(emp => emp.WorkEmail === workEmail)?.Image || null}`;
  const [unreadCount, setUnreadCount] = useState(0);
  const [newEmployees, setnewEmployees] = useState([]);
  const [newContracts, setnewContracts] = useState([]);
  const [newDepartments, setnewDepartments] = useState([]);
  const [newDivisions, setnewDivisions] = useState([]);
  const role = user?.role;

  useEffect(() => {
    if (token) {
      setToken(token);
      fetchEmployees(token);
      fetchEmployeeContracts(token);
      fetchDivisions(token);
      fetchDepartments(token);
    } else {
      window.location.href = '/';
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Cập nhật mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (role === 'Manager') {
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

  const dtEmployees = role === 'Manager' ? newEmployees : employees;
  const dtDivisions = role === 'Manager' ? newDivisions : divisions;
  const dtDepartments = role === 'Manager' ? newDepartments : departments;
  const dtEmployeeContracts = role === 'Manager' ? newContracts : employeecontracts;

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

  const fetchDepartments = async () => {
    try {
      const url = 'http://localhost:5000/api/admin/departments';
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng ban:', error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/divisions', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setDivisions(response.data);
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
              <Route path='home' element={<AdminHome dtEmployees={dtEmployees} dtDivisions={dtDivisions} dtEmployeeContracts={dtEmployeeContracts} dtDepartments={dtDepartments} />} />

              <Route path='employees' element={<EmployeeList fetchDepartments={fetchDepartments} departments={departments} employees={employees} fetchEmployees={fetchEmployees} />}>
                <Route path='employeelist' element={<General />} />
                <Route path='DependentList' element={<DependentList />} />
                <Route path='JobProfile' element={<JobProfile />} />
              </Route>

              <Route path='contracts' element={<Contract departments={departments} employees={employees} employeecontracts={employeecontracts} fetchEmployeeContracts={fetchEmployeeContracts} />}>
                <Route path='laborcontract' element={<LaborContract />} />
                <Route path='reginationList' element={<ReginationList />} />
              </Route>

              <Route path='periodicsalaries' element={<PeriodicSalary />}>
                <Route path='payrollcycle' element={<PayrollCycle />} />
                <Route path='benefit&salary' element={<Benefit_Salary />} />
                <Route path='salarypolicy' element={<SalaryPolicy />} />
                <Route path='benefitpolicy' element={<BenefitPolicy />} />
              </Route>

              <Route path='humanreports' element={<HumanReport departments={departments} employees={employees}/>}>
                <Route path='hrstatisticreport' element={<HRStatisticsReports divisions={divisions}/>} />
                <Route path='hranalysischart' element={<HRAnalysisChart />} />
                {/* <Route path='benefitpolicy' element={<BenefitPolicy />} /> */}
                {/* <Route index element={<HRStatisticsReports divisions={divisions}/>} /> */}
              </Route>

              <Route path='organizationalstructures' element={<OrganizationalStructure employees={employees} />} />
              <Route path='attendances' element={<Attendance />} />
              <Route path='workregulations' element={<WorkRegulations />} />
              <Route path='hrpolicies' element={<HRPolicy />} />
              <Route path='notifications' element={<Notification fetchUnreadCount={fetchUnreadCount} />} />
              <Route path='User/home' element={<HomeUser replace />} />
            </Routes>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;