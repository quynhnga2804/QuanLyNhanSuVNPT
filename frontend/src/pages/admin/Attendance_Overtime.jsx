import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendanceList from './AttendanceList';
import Overtimes from './Overtimes';

const Attendance = ({ employees, departments }) => {
    const [attendances, setAttendances] = useState([]);
    const [overtimes, setOvertimes] = useState([]);
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
            fetchOvertimes(token);
        }
    }, []);

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

    const fetchOvertimes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/overtimes', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setOvertimes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng lương:', error);
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
                        { key: '1', label: 'DANH SÁCH CHẤM CÔNG', children: <AttendanceList onClick={() => setActiveKey("1")} attendances={attendances} employees={employees} departments={departments} /> },
                        { key: '2', label: 'TĂNG CA', children: <Overtimes overtimes={overtimes} employees={employees} departments={departments} fetchOvertimes={fetchOvertimes} /> },
                    ]}
                />
            </div>
        </>
    )
}

export default Attendance;