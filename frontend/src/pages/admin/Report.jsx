import { Tabs,  } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Luong_PhucLoi from './Benefit_Salary';
import DanhSachPhuThuoc from './DependentList';
import LaborContract from './LaborContract';
import EmployeeReport from './EmployeeReport';

const Report = () => {
    const [activeKey, setActiveKey] = useState('1');
    // const [employeecontracts, setemployeecontracts] = useState([]);
    // const [laborcontracts, setlaborcontracts] = useState([]);
    // const [employees, setemployees] = useState([]);

    const token = localStorage.getItem('token');

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

    // const handleChange = (key) => {
    //     if (key === '1') {
    //         navigate('/admin/humanreports/hrstatisticreport');
    //     } else if (key === '2') {
    //         navigate('/admin/humanreports/hranalysischart');
    //     }
    // };

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
            console.log("ds nghỉ việc: ", response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nghỉ việc:', error);
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
                        { key: '1', label: 'BÁO CÁO NHÂN SỰ', children: <EmployeeReport /> },
                        { key: '2', label: 'BÁO CÁO LƯƠNG THƯỞNG', children: 'chưa có gì' },
                        { key: '3', label: 'BÁO CÁO HIỆU SUẤT LÀM VIỆC', children: 'chưa có gì' },
                        { key: '4', label: 'BÁO CÁO BẢO HIỂM, THUẾ', children: 'Nội dung cho tab TEAM VÀ QUẢN LÝ' },
                        { key: '5', label: 'BÁO CÁO THEO PHÒNG BAN, CHI NHÁNH', children: 'Nội dung cho tab TEAM VÀ QUẢN LÝ' },
                    ]}
                />
            </div>
        </>
    )
}

export default Report;