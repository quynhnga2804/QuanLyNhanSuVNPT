import { Button, Flex, Tabs, Typography, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Benefit_Salary from './Benefit_Salary';
import PayrollCycle from './PayrollCycle';
import SalaryPolicy from './SalaryPolicy';
import BenefitPolicy from './BenifitPolicy';
import AttendanceList from './AttendanceList';

const { Search } = Input;

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [payrollcycles, setPayrollCycles] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem("activeKey") || "1";
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchAttendances(token);
            // fetchMonthlySalaries(token);
            // fetchPayrollCycles(token);
            // fetchJobProfiles(token);
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/employees', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
        }
    };

    const fetchAttendances = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/attendances', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setAttendances(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng lương:', error);
        }
    };

    const fetchPayrollCycles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/payrollcycles', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setPayrollCycles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng chu kỳ lương:', error);
        }
    };

    const fetchJobProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/jobprofiles', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setJobProfiles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng hồ sơ công việc:', error);
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
                        { key: '1', label: 'DANH SÁCH CHẤM CÔNG', children: <AttendanceList onClick={() => setActiveKey("1")} fetchAttendances={fetchAttendances} attendances={attendances} /> },
                        { key: '2', label: 'BÁO CÁO', children: 'Nội dung cho tab BÁO CÁO' },
                    ]}
                />
            </div>
        </>
    )
}

export default Attendance;