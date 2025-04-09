import { Table, Button, Flex, Space, Typography, message } from 'antd';
import React, { useState, useEffect } from 'react';
import Search from 'antd/es/transfer/search';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const Overtimes = ({ overtimes, employees, fetchOvertimes, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tableFilters, setTableFilters] = useState({});
    const [newOTs, setNewOTs] = useState([]);
    const workEmail = JSON.parse(localStorage.getItem('user')).email;
    const role = JSON.parse(localStorage.getItem('user')).role;

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const handleApprove = async (record) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/overtimes/${record.ID_OT}`,
                { 
                    Status: 'Approved',
                    ApprovedAt: new Date().toISOString(),
                 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            fetchOvertimes();
            message.success('Đã duyệt!');
        } catch (error) {
            message.error('Duyệt thất bại, vui lòng thử lại.');
        }
    };

    const handleReject = async (record) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/overtimes/${record.ID_OT}`,
                { 
                    Status: 'Rejected',
                    ApprovedAt: new Date().toISOString(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            fetchOvertimes();
            message.success('Đã từ chối!');
        } catch (error) {
            message.error('Từ chối thất bại, vui lòng thử lại.');
        }
    };

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    useEffect(() => {
        if (role === 'Manager') {
            const empID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.EmployeeID;
            const filtered = overtimes.filter(ate => ate.ManagerID === empID);
            setNewOTs(filtered);
        }
    }, [role, overtimes, employees, departments, workEmail]);

    const dataSource = role === 'Manager' ? newOTs : overtimes;
    const filteredovertimes = dataSource.filter(ate => {
        const matchesSearchQuery = searchQuery === '' ||
            ate.EmployeeID.toLowerCase().includes(searchQuery) ||
            ate.OTType.toLowerCase().includes(searchQuery) ||
            employees.find(emp => emp.EmployeeID === ate.EmployeeID)?.FullName.toLowerCase().includes(searchQuery) ||
            employees.find(emp => emp.EmployeeID === ate.ManagerID)?.FullName.toLowerCase().includes(searchQuery);

        const selectedStatus = tableFilters.Status || [];
        const matchesStatusFilter = selectedStatus.length === 0 || selectedStatus.includes(ate.Status);

        const otDate = dayjs(ate.DateTime);
        const matchesDateRange = (!fromDate || otDate.isSameOrAfter(fromDate, 'day')) && (!toDate || otDate.isSameOrBefore(toDate, 'day'));

        return matchesSearchQuery && matchesStatusFilter && matchesDateRange;
    });

    const columns = [
        {
            title: 'MÃ',
            dataIndex: 'ID_OT',
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
            title: 'NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            align: 'left',
            minWidth: 109,
            render: (text, record) => {
                const employee = employees.find(emp => emp.EmployeeID === record.EmployeeID);
                return employee ? employee.FullName : text;
            }

        },
        {
            title: 'QUẢN LÝ',
            dataIndex: 'ManagerID',
            minWidth: 139,
            align: 'left',
            render: (text, record) => {
                const employee = employees.find(emp => emp.EmployeeID === record.ManagerID);
                return employee ? employee.FullName : text;
            }
        },
        {
            title: 'LÝ DO TĂNG CA',
            dataIndex: 'ReasonOT',
            minWidth: 100,
            align: 'left',
        },
        {
            title: 'LOẠI TĂNG CA',
            dataIndex: 'OTType',
            minWidth: 110,
            align: 'left',
        },
        {
            title: 'NGÀY TĂNG CA',
            dataIndex: 'DateTime',
            minWidth: 130,
            align: 'center',
            sorter: (a, b) => new Date(a.DateTime) - new Date(b.DateTime),
            render: (date) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: 'SỐ GIỜ',
            dataIndex: 'OverTimesHours',
            minWidth: 70,
            align: 'center',
        },
        {
            title: 'CHU KỲ LƯƠNG',
            dataIndex: 'ID_OT',
            minWidth: 117,
            align: 'center',
        },
        {
            title: 'NGÀY TẠO',
            dataIndex: 'CreatedAt',
            minWidth: 100,
            align: 'center',
            render: (date) => {
                if (date) return dayjs(date).format('DD-MM-YYYY');
                return '';
            }

        },
        {
            title: 'NGÀY DUYỆT',
            dataIndex: 'ApprovedAt',
            minWidth: 118,
            align: 'center',
            render: (date) => {
                if (date) return dayjs(date).format('DD-MM-YYYY');
                return '';
            }
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            minWidth: 112,
            align: 'center',
            fixed: 'right',
            filters: [
                { text: 'Chờ duyệt', value: 'Pending' },
                { text: 'Đã duyệt', value: 'Approved' },
                { text: 'Từ chối', value: 'Rejected' },
            ],
            filterMode: 'tree',
            render: (status) => {
                const statusMap = {
                    'Pending': { text: 'Chờ duyệt', color: 'orange' },
                    'Approved': { text: 'Đã duyệt', color: 'green' },
                    'Rejected': { text: 'Từ chối', color: 'red' },
                };

                return (
                    <span style={{ color: statusMap[status]?.color || 'black' }}>
                        {statusMap[status]?.text || status}
                    </span>
                );
            }
        },
    ];

    if (role === 'Manager') {
        columns.push({
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 95,
            render: (_, record) => (
                <>
                    <Button type='link' onClick={() => handleApprove(record)} style={{ border: 'none', height: '20px', width: '30px', marginRight: '3px' }} disabled={record.Status === 'Approved' || record.Status === 'Rejected'}><CheckOutlined /></Button>
                    <Button type='link' danger onClick={() => handleReject(record)} style={{ border: 'none', height: '20px', width: '30px' }} disabled={record.Status === 'Approved' || record.Status === 'Rejected'}><CloseOutlined /></Button>
                </>
            ),
        });
    }

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredovertimes.length}
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
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredovertimes.map(ate => ({ ...ate, key: ate.ID_Attendance }))}
                bordered
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
                onChange={handleTableChange}
            />
        </>
    );
};

export default Overtimes;