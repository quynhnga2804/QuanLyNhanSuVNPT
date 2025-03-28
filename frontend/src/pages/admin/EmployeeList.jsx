import { Tabs } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import General from './General';
import Benefit_Salary from './Benefit_Salary';
import DependentList from './DependentList';

const EmployeeList = ({ employees, fetchEmployees, departments, fetchDepartments }) => {
    const [users, setUsers] = useState([]);
    const [overtimes, setOvertimes] = useState([]);
    const [employeecontracts, setEmployeecontracts] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [monthlysalaries, setMonthlySalaries] = useState([]);
    const [payrollcycles, setPayrollCycles] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });
    const role = JSON.parse(localStorage.getItem('user')).role;

    const token = localStorage.getItem('token');

    useEffect(() => {
        localStorage.setItem('activeKey', activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchDepartments(token);
            fetchUsers(token);
            fetchEmployeeContracts(token);
            fetchMonthlySalaries(token);
            fetchPayrollCycles(token);
            fetchJobProfiles(token);
            fetchOverTimes(token);
            fetchFamilyMembers(token);
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách users:', error);
        }
    };

    const fetchOverTimes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/overtimes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOvertimes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tăng ca:', error);
        }
    };

    const fetchEmployeeContracts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/employeecontracts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmployeecontracts(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hợp đồng nhân viên:', error);
        }
    };

    const fetchMonthlySalaries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/monthlysalaries', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMonthlySalaries(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng lương:', error);
        }
    };

    const fetchPayrollCycles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/payrollcycles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPayrollCycles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng chu kỳ lương:', error);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/familymembers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFamilyMembers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng chu kỳ lương:', error);
        }
    };

    const fetchJobProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/jobprofiles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setJobProfiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng hồ sơ công việc:', error);
        }
    };

    return (
        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Tabs
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={setActiveKey}
                items={[
                    role !== 'Accountant' &&
                    { key: '1', label: 'TỔNG QUAN', children: <General onClick={() => setActiveKey('1')} departments={departments} employees={employees} users={users} employeecontracts={employeecontracts} fetchEmployees={fetchEmployees} fetchUsers={fetchUsers} /> },
                    role !== 'Manager' &&
                    { key: '2', label: 'LƯƠNG VÀ PHÚC LỢI', children: <Benefit_Salary onClick={() => setActiveKey('2')} familyMembers={familyMembers} fetchMonthlySalaries={fetchMonthlySalaries} overtimes={overtimes} monthlysalaries={monthlysalaries} employees={employees} payrollcycles={payrollcycles} jobprofiles={jobprofiles} /> },
                    role !== 'Manager' &&
                    { key: '3', label: 'DANH SÁCH PHỤ THUỘC', children: <DependentList employees={employees} familyMembers={familyMembers} fetchFamilyMembers={fetchFamilyMembers} /> },
                ]}
            />
        </div>
    );
};

export default EmployeeList;
