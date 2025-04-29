import { Tabs } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import AttendanceList from './AttendanceList';
import Overtimes from './Overtimes';
import { get } from '../../api/apiService';
import { UserContext } from '../../api/UserContext';

const Attendance = ({ employees, departments }) => {
    const [attendances, setAttendances] = useState([]);
    const [overtimes, setOvertimes] = useState([]);
    const [activeKey, setActiveKey] = useState(() => {
        return localStorage.getItem("activeKey") || "1";
    });
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    useEffect(() => {
        localStorage.setItem("activeKey", activeKey);
    }, [activeKey]);

    useEffect(() => {
        fetchAttendances();
        fetchOvertimes();
    }, []);

    const fetchAttendances = async () => {
        try {
            const response = await get('/admin/attendances');
            setAttendances(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng lương:', error);
        }
    };

    const fetchOvertimes = async () => {
        try {
            const response = await get('/admin/overtimes');
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