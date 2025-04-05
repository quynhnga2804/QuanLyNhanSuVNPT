import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LaborContract from './LaborContract';
import ReginationList from './ResignationList';

const Contract = ({ employeecontracts, fetchEmployeeContracts, employees, departments }) => {
    const [laborcontracts, setlaborcontracts] = useState([]);
    const [jobprofiles, setjobprofiles] = useState([]);
    const [resignations, setresignations] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });

    const token = localStorage.getItem('token');
    const role = JSON.parse(localStorage.getItem('user')).role;

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchLaborContracts(token);
            fetchJobProfiles(token);
            fetchResignations(token);
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

    const fetchResignations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/resignations', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setresignations(response.data);
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
                        { key: '1', label: 'HỢP ĐỒNG LAO ĐỘNG', children: <LaborContract onClick={() => setActiveKey('1')} departments={departments} employees={employees} employeecontracts={employeecontracts} laborcontracts={laborcontracts} jobprofiles={jobprofiles} fetchEmployeeContracts={fetchEmployeeContracts} /> },
                        role !== 'Accountant' &&
                        { key: '2', label: 'DANH SÁCH NGHỈ VIỆC', children: <ReginationList onClick={() => setActiveKey('2')} departments={departments} resignations={resignations} employees={employees} /> },
                    ]}
                />
            </div>
        </>
    )
}

export default Contract