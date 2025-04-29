import { Tabs } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import Benefit_Salary from './Benefit_Salary';
import PayrollCycle from './PayrollCycle';
import SalaryPolicy from './SalaryPolicy';
import BenefitPolicy from './BenifitPolicy';
import PayrollCycleList from './PayrollCycleList';
import { UserContext } from '../../api/UserContext';
import { get } from '../../api/apiService';

const PeriodicSalary = ({  departments, employees }) => {
    const [incomeTaxes, setIncomeTaxes] = useState([]);
    const [insurances, setInsurances] = useState([]);
    const [monthlysalaries, setMonthlySalaries] = useState([]);
    const [payrollcycles, setPayrollCycles] = useState([]);
    const [jobprofiles, setJobProfiles] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [overtimes, setOvertimes] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem('activeKey') || '1';
    });
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    useEffect(() => {
        localStorage.setItem('activeKey', activeKey);
    }, [activeKey]);

    useEffect(() => {
        fetchMonthlySalaries();
        fetchPayrollCycles();
        fetchJobProfiles();
        fetchOverTimes();
        fetchFamilyMembers();
        fetchIncomeTaxes();
        fetchInsurances();
    }, []);

    const fetchIncomeTaxes = async () => {
        try {
            const response = await get('/admin/incometaxes');
            setIncomeTaxes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thuế:', error);
        }
    };

    const fetchInsurances = async () => {
        try {
            const response = await get('/admin/insurances');
            setInsurances(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bảo hiểm:', error);
        }
    };

    const fetchOverTimes = async () => {
        try {
            const response = await get('/admin/overtimes');
            setOvertimes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tăng ca:', error);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await get('/admin/familymembers');
            setFamilyMembers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng chu kỳ lương:', error);
        }
    };

    const fetchMonthlySalaries = async () => {
        try {
            const response = await get('/admin/monthlysalaries');
            setMonthlySalaries(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng lương:', error);
        }
    };

    const fetchPayrollCycles = async () => {
        try {
            const response = await get('/admin/payrollcycles');
            setPayrollCycles(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng chu kỳ lương:', error);
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

    return (
        <>
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Tabs
                    className='menu-horizontal'
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    items={[
                        { key: '1', label: 'TỔNG QUAN', children: (<div className='tab-content-scrollable'><PayrollCycle onClick={() => setActiveKey('1')}  employees={employees} departments={departments} monthlysalaries={monthlysalaries} payrollcycles={payrollcycles} /></div>) },
                        (role === 'admin' || role === 'director' || role === 'accountant') &&
                        { key: '2', label: 'CHU KỲ LƯƠNG', children: (<div className='tab-content-scrollable'><PayrollCycleList onClick={() => setActiveKey('2')} fetchPayrollCycles={fetchPayrollCycles} payrollcycles={payrollcycles} /></div>) },
                        role === 'accountant' &&
                        { key: '3', label: 'LƯƠNG VÀ PHÚC LỢI', children: <Benefit_Salary onClick={() => setActiveKey('3')} insurances={insurances} incomeTaxes={incomeTaxes} familyMembers={familyMembers} fetchMonthlySalaries={fetchMonthlySalaries} overtimes={overtimes} monthlysalaries={monthlysalaries} employees={employees} payrollcycles={payrollcycles} jobprofiles={jobprofiles} /> },
                        { key: '4', label: 'CHÍNH SÁCH LƯƠNG', children: (<div className='tab-content-scrollable'><SalaryPolicy onClick={() => setActiveKey('4')} /></div>) },
                        { key: '5', label: 'CHÍNH SÁCH PHÚC LỢI', children: (<div className='tab-content-scrollable'><BenefitPolicy onClick={() => setActiveKey('5')} /></div>) },
                    ]}
                />
            </div>
        </>
    )
}

export default PeriodicSalary;