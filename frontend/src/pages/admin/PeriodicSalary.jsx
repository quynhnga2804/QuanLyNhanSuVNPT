import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Benefit_Salary from './Benefit_Salary';
import PayrollCycle from './PayrollCycle';
import SalaryPolicy from './SalaryPolicy';
import BenefitPolicy from './BenifitPolicy';
import PayrollCycleList from './PayrollCycleList';

const PeriodicSalary = () => {
    const [employees, setEmployees] = useState([]);
    const [monthlysalaries, setMonthlySalaries] = useState([]);
    const [payrollcycles, setPayrollCycles] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [overtimes, setOvertimes] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem("activeKey") || "1";
    });
    const role = JSON.parse(localStorage.getItem('user')).role;

    const token = localStorage.getItem('token');

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (token) {
            fetchEmployees(token);
            fetchMonthlySalaries(token);
            fetchPayrollCycles(token);
            fetchJobProfiles(token);
            fetchOverTimes(token);
            fetchFamilyMembers(token);
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

    const fetchOverTimes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/overtimes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOvertimes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tăng ca:', error);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/familymembers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFamilyMembers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng chu kỳ lương:', error);
        }
    };

    const fetchMonthlySalaries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/monthlysalaries', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setMonthlySalaries(response.data);
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
                        { key: '1', label: 'TỔNG QUAN', children: (<div className="tab-content-scrollable"><PayrollCycle onClick={() => setActiveKey('1')} monthlysalaries={monthlysalaries} payrollcycles={payrollcycles} /></div>) },
                        (role === 'Admin' || role === 'Director' || role === 'Accountant') &&
                        { key: '2', label: 'CHU KỲ LƯƠNG', children: (<div className="tab-content-scrollable"><PayrollCycleList onClick={() => setActiveKey('2')} fetchPayrollCycles={fetchPayrollCycles} payrollcycles={payrollcycles} /></div>) },
                        role === 'Accountant' &&
                        { key: '3', label: 'LƯƠNG VÀ PHÚC LỢI', children: <Benefit_Salary onClick={() => setActiveKey('3')} familyMembers={familyMembers} fetchMonthlySalaries={fetchMonthlySalaries} overtimes={overtimes} monthlysalaries={monthlysalaries} employees={employees} payrollcycles={payrollcycles} jobprofiles={jobprofiles} /> },
                        { key: '4', label: 'CHÍNH SÁCH LƯƠNG', children: (<div className="tab-content-scrollable"><SalaryPolicy onClick={() => setActiveKey('4')} /></div>) },
                        { key: '5', label: 'CHÍNH SÁCH PHÚC LỢI', children: (<div className="tab-content-scrollable"><BenefitPolicy onClick={() => setActiveKey('5')} /></div>) },
                    ]}
                />
            </div>
        </>
    )
}

export default PeriodicSalary;