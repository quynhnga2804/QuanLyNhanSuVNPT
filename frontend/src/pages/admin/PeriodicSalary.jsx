import { Button, Flex, Tabs, Typography, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Benefit_Salary from './Benefit_Salary';
import PayrollCycle from './PayrollCycle';
import SalaryPolicy from './SalaryPolicy';
import BenefitPolicy from './BenifitPolicy';

const { Search } = Input;

const PeriodicSalary = () => {
    const [employees, setEmployees] = useState([]);
    const [monthlysalaries, setMonthlySalaries] = useState([]);
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
            fetchEmployees(token);
            fetchMonthlySalaries(token);
            fetchPayrollCycles(token);
            fetchJobProfiles(token);
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
                        {
                            key: '1',
                            label: 'CHU KỲ LƯƠNG',
                            children: (
                                <div className="tab-content-scrollable">
                                    <PayrollCycle monthlysalaries={monthlysalaries} payrollcycles={payrollcycles} />
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: 'CHÍNH SÁCH LƯƠNG',
                            children: (
                                <div className="tab-content-scrollable">
                                    <SalaryPolicy />
                                </div>
                            ),
                        },
                        {
                            key: '3',
                            label: 'CHÍNH SÁCH PHÚC LỢI',
                            children: (
                                <div className="tab-content-scrollable">
                                    <BenefitPolicy />
                                </div>
                            ),
                        },
                        {
                            key: '4',
                            label: 'BÁO CÁO',
                            children: 'Nội dung cho tab BÁO CÁO',
                        },
                    ]}
                />
            </div>
        </>
    )
}

export default PeriodicSalary;