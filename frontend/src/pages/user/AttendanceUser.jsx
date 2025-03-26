import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const AttendanceUser = () => {
    const [attendanceUser, setAttendanceUser] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    // const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');

    const uniquePayroll = Array.from( new Map(attendanceUser.map(att => [att.ID_PayrollCycle, { text: att.PayrollCycle?.PayrollName, value: att.ID_PayrollCycle }])).values());
    // const uniqueOTType = [...new Set(mappedattertimeData.map(att => att.OTType))];
    // const uniqueStatus = [...new Set(mappedattertimeData.map(att => att.Status))];


    useEffect(() => {
        if (token)
            fetchAttendenceUser();
    }, [token]);

    const fetchAttendenceUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/attendances', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAttendanceUser(response.data);
        } catch (error) {
            console.log("Lỗi khi lấy dữ liệu chấm công: ", error);
            message.error("Không lấy được dữ liệu chấm công!");
        }
    };

    const filteredAttendanceUser = attendanceUser.filter(att => {
        if (dateRange && dateRange.length === 2) {
            const date = dayjs(att.AttendancesDate);
            return date.isSameOrAfter(dateRange[0].startOf('day')) && date.isSameOrBefore(dateRange[1].endOf('day'));
        }
        return true;
    });
    

    const columns = [
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'Employee',
            width: 150,
            fixed: 'left',
            align: 'center',
            ellipsis: true,
            render: (employee) => employee?.FullName || '',
        },
        {
            title: 'KỲ LƯƠNG',
            dataIndex: 'PayrollCycle',
            width: 150,
            align: 'center',
            ellipsis: true,
            render: (payroll) => payroll?.PayrollName || '',
            filters: uniquePayroll,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.ID_PayrollCycle === value,
        },
        {
            title: 'NGÀY CHẤM CÔNG',
            dataIndex: 'AttendancesDate',
            width: 130,
            align: 'center',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a, b) => new Date(a.AttendancesDate) - new Date(b.AttendancesDate),
        },
        {
            title: 'NGÀY TRONG TUẦN',
            dataIndex: 'AttendancesDate',
            width: 130,
            align: 'center',
            render: (date) => {
                const d = new Date(date);
                const dayOfWeek = d.getDay();
                const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                return days[dayOfWeek];
            }
        },
        {
            title: 'GIỜ VÀO',
            dataIndex: 'CheckInTime',
            width: 100,
            align: 'center',
        },
        {
            title: 'GIỜ RA',
            dataIndex: 'CheckOutTime',
            width: 100,
            align: 'center',
        },
        {
            title: 'TỔNG GIỜ LÀM VIỆC',
            dataIndex: 'TotalHoursWorked',
            width: 150,
            align: 'center',
            sorter: (a, b) => a.TotalHoursWorked - b.TotalHoursWorked,
        }
    ];

    // const handleSearch = debounce((value) => setSearchQuery(value.toLowerCase()), 500);
    
    // const filteredAttendances = attendanceUser.filter(att =>
    //     att.Status?.toLowerCase().includes(searchQuery) ||
    //     att.OTType?.toLowerCase().includes(searchQuery) ||
    //     att.ManagerName?.toLowerCase().includes(searchQuery)
    // );

    return (
        <Flex vertical style={{ width: '100%' }}>
            <Flex justify='end' style={{ padding: '10px 20px 0 20px', backgroundColor: 'lightslategray'}}>
                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px',  }}>
                    <DatePicker.RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => setDateRange(dates)}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        allowClear
                        
                    />
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredAttendanceUser}
                bordered
                size='medium'
                scroll={{
                    x: 1200, // đủ lớn để không bị díu
                    y: 52.8 * 9,
                }}
                pagination={false}
            />
        </Flex>
    );
};
export default AttendanceUser;
