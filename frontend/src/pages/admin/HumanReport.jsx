import { Tabs,  } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRStatisticsReports from './HRStatisticsReports';
import HRAnalysisChart from './HRAnalysisChart';

const HumanReport = ({employees, departments}) => {
    const [employeecontracts, setEmployeecontracts] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [personalprofiles, setPersonalProfiles] = useState([]);
    const [resignations, setResignations] = useState([]);
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
            fetchEmployeeContracts(token);
            fetchJobProfiles(token);
            fetchPersonalProfiles(token);
            fetchResignations(token);
        }
    }, []);

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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPersonalProfiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng hồ sơ công việc:', error);
        }
    };
    const fetchResignations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/resignations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResignations(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nghỉ việc:', error);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'none'}}>
            <Tabs
                destroyInactiveTabPane={true}
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={setActiveKey}
                items={[
                    role === 'Manager' &&
                    { key: '1', label: 'THỐNG KÊ VÀ BÁO CÁO NHÂN SỰ', children: <HRStatisticsReports key={activeKey} onClick={() => setActiveKey('1')} employeecontracts={employeecontracts} resignations={resignations} jobprofiles={jobprofiles} personalprofiles={personalprofiles} departments={departments} employees={employees} /> },
                    { key: '2', label: 'BIỂU ĐỒ PHÂN TÍCH NHÂN SỰ', children: <HRAnalysisChart onClick={() => setActiveKey('2')} resignations={resignations} departments={departments} employees={employees} jobprofiles={jobprofiles} personalprofiles={personalprofiles}/>},
                ]}
            />
        </div>
        
    );
};

export default HumanReport;