import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Luong_PhucLoi from './Benefit_Salary';
import LaborContract from './LaborContract';

const Contract = ({ employeecontracts, fetchEmployeeContracts }) => {
    const [activeKey, setActiveKey] = useState('1');
    const [laborcontracts, setlaborcontracts] = useState([]);
    const [jobprofiles, setjobprofiles] = useState([]);
    const [employees, setemployees] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchLaborContracts(token);
            fetchEmployees(token);
            fetchJobProfiles(token);
        }
    }, []);
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/employees', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setemployees(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
        }
    };

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
                        { key: '1', label: 'HỢP ĐỒNG LAO ĐỘNG', children: <LaborContract employeecontracts={employeecontracts} laborcontracts={laborcontracts} jobprofiles={jobprofiles} fetchEmployeeContracts={fetchEmployeeContracts} employees={employees} /> },
                        { key: '2', label: 'QUYẾT ĐỊNH NHẬN TUYỂN', children: <Luong_PhucLoi /> },
                        { key: '3', label: 'DANH SÁCH NGHỈ VIỆC', children: <Luong_PhucLoi /> },
                        { key: '4', label: 'PHÂN LOẠI HỢP ĐỒNG', children: 'Nội dung cho tab TEAM VÀ QUẢN LÝ' },
                    ]}
                />
            </div>
        </>
    )
}

export default Contract