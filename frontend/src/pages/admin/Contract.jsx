import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import EmployeeContractList from './EmployeeContractList';
import { get } from '../../api/apiService';
import LaborContractList from './LaborContractList';

const Contract = ({ employeecontracts, fetchEmployeeContracts, employees, departments }) => {
    const [laborcontracts, setlaborcontracts] = useState([]);
    const [jobprofiles, setjobprofiles] = useState([]);
    const [resignations, setresignations] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        fetchLaborContracts();
        fetchJobProfiles();
        fetchResignations();
    }, []);

    const fetchLaborContracts = async () => {
        try {
            const response = await get('/admin/laborcontracts');
            setlaborcontracts(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hồ sơ:', error);
        }
    };

    const fetchJobProfiles = async () => {
        try {
            const response = await get('/admin/jobprofiles');
            setjobprofiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hồ sơ:', error);
        }
    };

    const fetchResignations = async () => {
        try {
            const response = await get('/admin/resignations');
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
                        { key: '1', label: 'HỢP ĐỒNG LAO ĐỘNG', children: <EmployeeContractList onClick={() => setActiveKey('1')} departments={departments} employees={employees} employeecontracts={employeecontracts} laborcontracts={laborcontracts} jobprofiles={jobprofiles} fetchEmployeeContracts={fetchEmployeeContracts} /> },
                        { key: '2', label: 'CÁC LOẠI HỢP ĐỒNG', children: <LaborContractList onClick={() => setActiveKey('1')} laborcontracts={laborcontracts} fetchLaborContracts={fetchLaborContracts} /> },
                    ]}
                />
            </div>
        </>
    )
}

export default Contract