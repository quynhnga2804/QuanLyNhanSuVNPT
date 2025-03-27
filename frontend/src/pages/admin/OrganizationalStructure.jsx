import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import DivisionList from './DivisionList';
import DepartmentList from './DepartmentList';
import axios from 'axios';

const OrganizationalStructure = () => {
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });

    const token = localStorage.getItem('token');
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
                    { key: '1', label: 'DANH SÁCH BỘ PHẬN', children: <DivisionList onClick={() => setActiveKey('1')} divisions={divisions} fetchDivisions={fetchDivisions} /> },
                    { key: '2', label: 'DANH SÁCH PHÒNG BAN', children: <DepartmentList onClick={() => setActiveKey('2')} divisions={divisions} fetchDepartments={fetchDepartments} departments={departments} /> },
                    { key: '3', label: 'CHƯA CÓ NỘI DUNG', children: 'CHƯA CÓ NỘI DUNG' },
                    { key: '4', label: 'CHƯA CÓ NỘI DUNG', children: 'CHƯA CÓ NỘI DUNG' },
                    { key: '5', label: 'CHƯA CÓ NỘI DUNG', children: 'CHƯA CÓ NỘI DUNG' },
                    { key: '6', label: 'CHƯA CÓ NỘI DUNG', children: 'CHƯA CÓ NỘI DUNG' },
                    { key: '7', label: 'Page 1', children: 'Nội dung Page 1' },
                ]}
            />
        </div>
    )
}

export default OrganizationalStructure;