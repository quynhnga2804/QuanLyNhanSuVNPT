import { Tabs } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import General from './General';
import DependentList from './DependentList';
import JobProfile from './JobProfile';
import PersonalProfile from './PersonalProfile';
import { UserContext } from '../../api/UserContext';
import { get } from '../../api/apiService';

const EmployeeList = ({ employees, fetchEmployees, departments }) => {
    const [users, setUsers] = useState([]);
    const [employeecontracts, setEmployeecontracts] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [personalprofiles, setPersonalProfiles] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    useEffect(() => {
        localStorage.setItem('activeKey', activeKey);
    }, [activeKey]);

    useEffect(() => {
        fetchUsers();
        fetchEmployeeContracts();
        fetchJobProfiles();
        fetchFamilyMembers();
        fetchPersonalProfiles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách users:', error);
        }
    };

    const fetchEmployeeContracts = async () => {
        try {
            const response = await get('/admin/employeecontracts');
            setEmployeecontracts(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hợp đồng nhân viên:', error);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await get('/admin/familymembers');
            setFamilyMembers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng người phụ thuộc:', error);
        }
    };

    const fetchJobProfiles = async () => {
        try {
            const response = await get('/admin/jobprofiles');
            setJobProfiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng hồ sơ công việc:', error);
        }
    };

    const fetchPersonalProfiles = async () => {
        try {
            const response = await get('/admin/personalprofiles');
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
                    role !== 'accountant' &&
                    { key: '1', label: 'DANH SÁCH NHÂN VIÊN', children: <General departments={departments} employees={employees} users={users} employeecontracts={employeecontracts} fetchEmployees={fetchEmployees} fetchUsers={fetchUsers} /> },
                    role !== 'accountant' &&
                    { key: '2', label: 'HỒ SƠ CÁ NHÂN', children: <PersonalProfile personalprofiles={personalprofiles} fetchPersonalProfiles={fetchPersonalProfiles} departments={departments} employees={employees} /> },
                    role !== 'accountant' &&
                    { key: '3', label: 'HỒ SƠ CÔNG VIỆC', children: <JobProfile jobprofiles={jobprofiles} fetchJobProfiles={fetchJobProfiles} departments={departments} employees={employees} /> },
                    (role === 'admin' || role === 'director') &&
                    { key: '4', label: 'DANH SÁCH PHỤ THUỘC', children: <DependentList employees={employees} familyMembers={familyMembers} fetchFamilyMembers={fetchFamilyMembers} /> },
                ]}
            />
        </div>
    );
};

export default EmployeeList;
