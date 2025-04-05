import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import DivisionList from './DivisionList';
import DepartmentList from './DepartmentList';
import axios from 'axios';

const OrganizationalStructure = ({ employees }) => {
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });

    const token = localStorage.getItem('token');
    const role = JSON.parse(localStorage.getItem('user')).role;
    useEffect(() => {
        localStorage.setItem('activeKey', activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchDivisions(token);
            fetchDepartments(token);
        }
    }, []);

    const fetchDivisions = async () => {
        const token = localStorage.getItem('token');

        try {
            const url = 'http://localhost:5000/api/admin/divisions';
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            setDivisions(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bộ phận:', error);
        }
    };

    const fetchDepartments = async () => {
        const token = localStorage.getItem('token');

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
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
        }
    };

    return (
        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Tabs
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={setActiveKey}
                items={[
                    (role === 'Admin' || role === 'Director') &&
                    { key: '1', label: 'DANH SÁCH BỘ PHẬN', children: <DivisionList onClick={() => setActiveKey('1')} divisions={divisions} fetchDivisions={fetchDivisions} /> },
                    { key: '2', label: 'DANH SÁCH PHÒNG BAN', children: <DepartmentList onClick={() => setActiveKey('2')} employees={employees} divisions={divisions} fetchDepartments={fetchDepartments} departments={departments} /> },
                ]}
            />
        </div>
    )
}

export default OrganizationalStructure;