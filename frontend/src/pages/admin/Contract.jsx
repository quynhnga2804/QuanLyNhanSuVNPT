import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LaborContract from './LaborContract';
import ReginationList from './ReginationList';

const Contract = ({ employeecontracts, fetchEmployeeContracts, employees }) => {
    const [activeKey, setActiveKey] = useState('1');
    const [laborcontracts, setlaborcontracts] = useState([]);
    const [jobprofiles, setjobprofiles] = useState([]);

    const token = localStorage.getItem('token');
    const role = JSON.parse(localStorage.getItem('user')).role;

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchLaborContracts(token);
            fetchJobProfiles(token);
        }
    }, []);

    const fetchLaborContracts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/laborcontracts', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setlaborcontracts(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hồ sơ:', error);
        }
    };

    const fetchJobProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/jobprofiles', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setjobprofiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hồ sơ:', error);
        }
    };

    return (
        <>
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Tabs
                    className='menu-horizontal'
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    items={[
                        role !== 'Accountant' &&
                        { key: '1', label: 'HỢP ĐỒNG LAO ĐỘNG', children: <LaborContract employeecontracts={employeecontracts} laborcontracts={laborcontracts} jobprofiles={jobprofiles} fetchEmployeeContracts={fetchEmployeeContracts} employees={employees} /> },
                        { key: '2', label: 'DANH SÁCH NGHỈ VIỆC', children: <ReginationList /> },
                        { key: '3', label: 'PHÂN LOẠI HỢP ĐỒNG', children: 'Nội dung cho tab TEAM VÀ QUẢN LÝ' },
                    ]}
                />
            </div>
        </>
    )
}

export default Contract