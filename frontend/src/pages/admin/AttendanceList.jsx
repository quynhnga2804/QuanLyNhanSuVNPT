import { Table, Flex, Space, Typography } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { UserContext } from '../../api/UserContext';

const AttendanceList = ({ attendances, employees, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [newAttendances, setNewAttendances] = useState([]);
    const { user } = useContext(UserContext);
    const workEmail = user?.email;
    const role = user?.role.toLowerCase();

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
        if (role === 'manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const filteredEmployees = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            const filtered = attendances.filter(ate => filteredEmployees.some(emp => emp.EmployeeID === ate.EmployeeID));
            setNewAttendances(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const dataSource = role === 'manager' ? newAttendances : attendances;

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
                    <Space  direction="vertical" size={12}>
                        <RangePicker
                            format='DD-MM-YYYY'
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={(dates) => {
                                if (dates && dates.length === 2) {
                                    setFromDate(dates[0]);
                                    setToDate(dates[1]);
                                } else {
                                    setFromDate(null);
                                    setToDate(null);
                                }
                            }}
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