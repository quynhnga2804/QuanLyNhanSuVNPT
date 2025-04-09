import { Table, Flex, Space, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const AttendanceList = ({ attendances, employees, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [newAttendances, setNewAttendances] = useState([]);
    const workEmail = JSON.parse(localStorage.getItem('user')).email;
    const role = JSON.parse(localStorage.getItem('user')).role;

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const columns = [
        {
            title: 'MÃ',
            dataIndex: 'ID_Attendance',
            fixed: 'left',
            minWidth: 50,
            align: 'center',
        },
        {
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            align: 'center',
            minWidth: 109,
        },
        {
            title: 'NGÀY CHẤM CÔNG',
            dataIndex: 'AttendancesDate',
            minWidth: 139,
            align: 'center',
            render: (date) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: 'GIỜ VÀO',
            dataIndex: 'CheckInTime',
            minWidth: 100,
            align: 'center',
        },
        {
            title: 'ĐỊA ĐIỂM VÀO',
            dataIndex: 'CheckInLocation',
            minWidth: 100,
            align: 'left',
        },
        {
            title: 'GIỜ RA',
            dataIndex: 'CheckOutTime',
            minWidth: 100,
            align: 'center',
        },
        {
            title: 'ĐỊA ĐIỂM RA',
            dataIndex: 'CheckOutLocation',
            minWidth: 100,
            align: 'left',
        },
        {
            title: 'TỔNG GIỜ LÀM',
            dataIndex: 'TotalHoursWorked',
            minWidth: 118,
            align: 'center',
            fixed: 'right',
        },
    ];

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    useEffect(() => {
        if (role === 'Manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const filteredEmployees = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            const filtered = attendances.filter(ate => filteredEmployees.some(emp => emp.EmployeeID === ate.EmployeeID));
            setNewAttendances(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const dataSource = role === 'Manager' ? newAttendances : attendances;

    const filteredAttendances = dataSource.filter(ate => {
        const matchessearchQuery = searchQuery === '' ||
            ate.CheckInLocation.toLowerCase().includes(searchQuery) ||
            ate.CheckOutLocation.toLowerCase().includes(searchQuery);

        const otDate = dayjs(ate.AttendancesDate);
        const matchesDateRange = (!fromDate || otDate.isSameOrAfter(fromDate, 'day')) && (!toDate || otDate.isSameOrBefore(toDate, 'day'));

        return matchessearchQuery && matchesDateRange;
    });

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space style={{ border: '1px solid #d9d9d9', borderRadius: '5px', padding: '0 5px' }}>
                        <DatePicker
                            style={{ border: 'none' }}
                            placeholder='Từ ngày'
                            format='DD-MM-YYYY'
                            onChange={(date) => setFromDate(date)}
                        />
                        <DatePicker
                            style={{ border: 'none' }}
                            placeholder='Đến ngày'
                            format='DD-MM-YYYY'
                            onChange={(date) => setToDate(date)}
                        />
                    </Space>

                    <Space>
                        <Search
                            placeholder='Tìm kiếm địa điểm...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredAttendances.map(ate => ({ ...ate, key: ate.ID_Attendance }))}
                bordered
                size='small'
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
            />
        </>
    );
};

export default AttendanceList;