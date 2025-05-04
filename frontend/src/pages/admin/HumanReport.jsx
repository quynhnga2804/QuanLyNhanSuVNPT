import { Tabs, } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import HRStatisticsReports from './HRStatisticsReports';
import HRAnalysisChart from './HRAnalysisChart';
import { UserContext } from '../../api/UserContext';
import { get } from '../../api/apiService';

const HumanReport = ({ employees, departments }) => {
    const [employeecontracts, setEmployeecontracts] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [personalprofiles, setPersonalProfiles] = useState([]);
    const [resignations, setResignations] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    useEffect(() => {
        localStorage.setItem('activeKey', activeKey);
    }, [activeKey]);

    useEffect(() => {
        fetchEmployeeContracts();
        fetchJobProfiles();
        fetchPersonalProfiles();
        fetchResignations();
    }, []);

    const fetchEmployeeContracts = async () => {
        try {
            const response = await get('/admin/employeecontracts');
            setEmployeecontracts(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hợp đồng nhân viên:', error);
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
            console.error('Lỗi khi lấy bảng hồ sơ công việc:', error);
        }
    };
    const fetchResignations = async () => {
        try {
            const response = await get('/admin/resignations');
            setResignations(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nghỉ việc:', error);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'none' }}>
            <Tabs
                destroyInactiveTabPane={true}
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={setActiveKey}
                items={[
                    (role === 'manager' || role === 'hr') &&
                    { key: '1', label: 'THỐNG KÊ VÀ BÁO CÁO NHÂN SỰ', children: <HRStatisticsReports key={activeKey} onClick={() => setActiveKey('1')} employeecontracts={employeecontracts} resignations={resignations} jobprofiles={jobprofiles} personalprofiles={personalprofiles} departments={departments} employees={employees} /> },
                    { key: '2', label: 'BIỂU ĐỒ PHÂN TÍCH NHÂN SỰ', children: <HRAnalysisChart onClick={() => setActiveKey('2')} resignations={resignations} departments={departments} employees={employees} jobprofiles={jobprofiles} personalprofiles={personalprofiles} /> },
                ]}
            />
        </div>

    );
};

export default HumanReport;