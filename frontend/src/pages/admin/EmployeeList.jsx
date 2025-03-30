import { Tabs } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import General from './General';
import DependentList from './DependentList';
import JobProfile from './JobProfile';
import PersonalProfile from './PersonalProfile';

const EmployeeList = ({ employees, fetchEmployees, departments }) => {
    const [users, setUsers] = useState([]);
    const [employeecontracts, setEmployeecontracts] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [personalprofiles, setPersonalProfiles] = useState([]);
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
            fetchUsers(token);
            fetchEmployeeContracts(token);
            fetchJobProfiles(token);
            fetchFamilyMembers(token);
            fetchPersonalProfiles(token);
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

    const fetchFamilyMembers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/familymembers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFamilyMembers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng người phụ thuộc:', error);
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

    const fetchPersonalProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/personalprofiles', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setPersonalProfiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng hồ sơ cá nhân:', error);
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
                    { key: '1', label: 'DANH SÁCH NHÂN VIÊN', children: <General onClick={() => setActiveKey('1')} departments={departments} employees={employees} users={users} employeecontracts={employeecontracts} fetchEmployees={fetchEmployees} fetchUsers={fetchUsers} /> },
                    role !== 'Accountant' &&
                    { key: '2', label: 'HỒ SƠ CÁ NHÂN', children: <PersonalProfile personalprofiles={personalprofiles} fetchPersonalProfiles={fetchPersonalProfiles} departments={departments} employees={employees} /> },
                    role !== 'Accountant' &&
                    { key: '3', label: 'HỒ SƠ CÔNG VIỆC', children: <JobProfile jobprofiles={jobprofiles} fetchJobProfiles={fetchJobProfiles} departments={departments} employees={employees} /> },
                    role !== 'Manager' && role !== 'Accountant' &&
                    { key: '4', label: 'DANH SÁCH PHỤ THUỘC', children: <DependentList employees={employees} familyMembers={familyMembers} fetchFamilyMembers={fetchFamilyMembers} /> },
                ]}
            />
        </div>
    );
};

export default EmployeeList;
