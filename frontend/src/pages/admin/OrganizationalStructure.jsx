import React, { useEffect, useState, useContext } from 'react';
import { Tabs } from 'antd';
import DivisionList from './DivisionList';
import DepartmentList from './DepartmentList';
import { UserContext } from '../../api/UserContext';
import { get } from '../../api/apiService';

const OrganizationalStructure = ({ employees }) => {
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });

    const token = localStorage.getItem('token');
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
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
        try {
            const response = await get('/admin/divisions');
            setDivisions(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bộ phận:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await get('/admin/departments');
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
                    (role === 'admin' || role === 'director') &&
                    { key: '1', label: 'DANH SÁCH BỘ PHẬN', children: <DivisionList onClick={() => setActiveKey('1')} divisions={divisions} fetchDivisions={fetchDivisions} /> },
                    { key: '2', label: 'DANH SÁCH PHÒNG BAN', children: <DepartmentList onClick={() => setActiveKey('2')} employees={employees} divisions={divisions} fetchDepartments={fetchDepartments} departments={departments} /> },
                ]}
            />
        </div>
    )
}

export default OrganizationalStructure;