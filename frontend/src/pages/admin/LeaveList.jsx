import { Button, Flex, Space, Table, Typography, DatePicker, message } from 'antd';
const { RangePicker } = DatePicker;
import React, { useState, useEffect, useContext } from 'react';
import { FileExcelOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import exportToExcel from '../../utils/exportToExcel';
import dayjs from 'dayjs';
import { UserContext } from '../../api/UserContext';
import { put } from '../../api/apiService';

const LeaveList = ({ leaves, fetchLeaves, employees, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tableFilters, setTableFilters] = useState({});
    const [newLeaves, setNewLeaves] = useState([]);
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    useEffect(() => {
        if (role === 'manager') {
            const relatedEmployeeIDs = employees.map(dv => dv.EmployeeID);
            const filtered = leaves.filter(emp => relatedEmployeeIDs.includes(emp.EmployeeID));
            setNewLeaves(filtered);
        }
    }, [role, employees]);

    const dataSource = role === 'manager' ? newLeaves : leaves;

    const filteredLeaves = dataSource.filter(res => {
        const matchesSearchQuery = res.Status.toLowerCase() !== 'pending' && (
            searchQuery === '' ||
            res.EmployeeID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employees.find(e => e.EmployeeID === res.EmployeeID)?.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employees.find(e => e.EmployeeID === res.ManagerID)?.FullName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const selectedStatus = tableFilters.Status || [];
        const matchesStatusFilter = selectedStatus.length === 0 || selectedStatus.includes(res.Status);

        const matchesDateRange = ((!fromDate || dayjs(res.StartDate).isSameOrAfter(fromDate, 'day')) && (!toDate || dayjs(res.StartDate).isSameOrBefore(toDate, 'day'))) ||
            ((!fromDate || dayjs(res.EndDate).isSameOrAfter(fromDate, 'day')) && (!toDate || dayjs(res.EndDate).isSameOrBefore(toDate, 'day')));

        return matchesSearchQuery && matchesStatusFilter && matchesDateRange;
    });
    const filteredPendings = dataSource.filter(res => res.Status.toLowerCase() === 'pending');

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            minWidth: 45,
            fixed: 'left',
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 115,
            align: 'center',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                return employee ? employee.FullName : '';
            },
        },
        {
            title: 'NGƯỜI DUYỆT',
            dataIndex: 'ManagerID',
            minWidth: 115,
            align: 'center',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                return employee ? employee.FullName : '';
            },
        },
        {
            title: 'PHÒNG BAN',
            dataIndex: 'EmployeeID',
            minWidth: 115,
            align: 'left',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                const department = departments.find(dept => dept.DepartmentID === employee?.DepartmentID);
                return department ? department.DepartmentName : '';
            },
        },
        {
            title: 'LÝ DO',
            dataIndex: 'LeaveReason',
            minWidth: 119,
            align: 'right',
        },
        {
            title: 'TỪ NGÀY',
            dataIndex: 'StartDate',
            align: 'center',
            minWidth: 132,
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'ĐẾN NGÀY',
            dataIndex: 'EndDate',
            align: 'center',
            minWidth: 132,
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            minWidth: 119,
            align: 'center',
            filters: [
                { text: 'Đã duyệt', value: 'Approved' },
                { text: 'Từ chối', value: 'Rejected' },
            ],
            filterMode: 'tree',
            render: (status) => {
                const statusMap = {
                    'Approved': { text: 'Đã duyệt', color: 'green' },
                    'Rejected': { text: 'Từ chối', color: 'red' },
                };
                const { text, color } = statusMap[status] || { text: 'Không xác định', color: 'default' };
                return <span style={{ color }}>{text}</span>;
            }
        },
        {
            title: 'THỜI GIAN TẠO',
            dataIndex: 'CreatedAt',
            minWidth: 119,
            align: 'center',
            sorter: (a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY - HH:mm:ss') : '',
        },
        {
            title: 'THỜI GIAN PHẢN HỒI',
            dataIndex: 'ApprovedAt',
            minWidth: 165,
            fixed: 'right',
            align: 'center',
            sorter: (a, b) => new Date(a.ApprovedAt) - new Date(b.ApprovedAt),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY - HH:mm:ss') : '',
        },
    ];

    const columnPendings = [
        {
            title: 'STT',
            dataIndex: 'stt',
            minWidth: 45,
            fixed: 'left',
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 115,
            align: 'left',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                return employee ? employee.FullName : '';
            },
        },
        {
            title: 'PHÒNG BAN',
            dataIndex: 'EmployeeID',
            minWidth: 115,
            align: 'left',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                const department = departments.find(dept => dept.DepartmentID === employee?.DepartmentID);
                return department ? department.DepartmentName : '';
            },
        },
        {
            title: 'LÝ DO',
            dataIndex: 'LeaveReason',
            minWidth: 119,
            align: 'right',
        },
        {
            title: 'TỪ NGÀY',
            dataIndex: 'StartDate',
            align: 'center',
            minWidth: 132,
            sorter: (a, b) => new Date(a.StartDate) - new Date(b.StartDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'ĐẾN NGÀY',
            dataIndex: 'EndDate',
            align: 'center',
            minWidth: 132,
            sorter: (a, b) => new Date(a.EndDate) - new Date(b.EndDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            minWidth: 119,
            align: 'center',
            render: (status) => {
                const text = status || 'Không xác định';
                return <span style={{ color: 'orange' }}>{text}</span>;
            }
        },
        {
            title: 'THỜI GIAN TẠO',
            dataIndex: 'CreatedAt',
            minWidth: 119,
            align: 'center',
            sorter: (a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY - HH:mm:ss') : '',
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 106,
            render: (_, record) => (
                <>
                    <Button type='link' onClick={() => handleApprove(record)} style={{ border: 'none', height: '20px', width: '40px' }} ><CheckOutlined /></Button>
                    <Button type='link' danger onClick={() => handleReject(record)} style={{ border: 'none', height: '20px', width: '40px' }} ><CloseOutlined /></Button>
                </>
            ),
        }
    ];

    const handleApprove = async (record) => {
        try {
            await put(`/admin/leaves/${record.LeaveRequestID}`, {
                Status: 'Approved',
                ApprovedAt: new Date().toISOString(),
            });
            fetchLeaves();
            message.success('Đã duyệt!');
        } catch (error) {
            message.error('Duyệt thất bại, vui lòng thử lại.');
        }
    };

    const handleReject = async (record) => {
        try {
            await put(`/admin/leaves/${record.LeaveRequestID}`, {
                Status: 'Rejected',
                ApprovedAt: new Date().toISOString(),
            });
            fetchLeaves();
            message.success('Đã từ chối!');
        } catch (error) {
            message.error('Từ chối thất bại, vui lòng thử lại.');
        }
    };

    const handleExportLeaves = () => {
        const columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'MÃ NHÂN VIÊN', key: 'EmployeeID', width: 20 },
            { header: 'LÝ DO NGHỈ', key: 'LeaveReason', width: 25 },
            { header: 'TỪ NGÀY', key: 'StartDate', width: 30 },
            { header: 'ĐẾN NGÀY', key: 'EndDate', width: 15 }
        ];

        const data = filteredLeaves
            .filter(res => res.Status?.toLowerCase() !== 'pending')
            .map((res, index) => {
                const employee = employees.find(emp => emp.EmployeeID === res.EmployeeID);
                return {
                    stt: index + 1,
                    EmployeeID: res.EmployeeID,
                    FullName: employee ? employee.FullName : '',
                    LeaveReason: res.LeaveReason,
                    StartDate: dayjs(res.StartDate).format('DD-MM-YYYY'),
                    EndDate: dayjs(res.EndDate).format('DD-MM-YYYY'),
                };
            });

        exportToExcel(data, columns, 'DanhSachNghiPhep');
    };
    const hScr = 51.5 * 9;

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space direction="vertical" size={12}>
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
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    {role === 'manager' && (
                        < Button disabled={!(role === 'manager' && dataSource.length > 0)} type="primary" onClick={handleExportLeaves} icon={<FileExcelOutlined />}>
                            File excel
                        </Button>
                    )}
                </Flex>
            </Flex >

            <Table
                className='table_TQ'
                rowKey='LeaveRequestID'
                columns={columns}
                dataSource={filteredLeaves.map(emp => ({ ...emp, key: emp.LeaveRequestID }))}
                onRow={(record) => ({
                    onDoubleClick: () => showModal(record),
                })}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: role === 'manager' ? hScr - 51.5 * 4 : hScr,
                }}
                pagination={false}
                onChange={handleTableChange}
            />

            {role === 'manager' && (
                <>
                    <Typography.Title level={6} type='secondary' style={{ color: '#2b2b2b', paddingTop: '15px', paddingLeft: '10px', fontWeight: '100', fontSize: '1rem' }}>
                        Danh sách chưa phản hồi
                    </Typography.Title>

                    <Table
                        className='table_TQ'
                        rowKey='LeaveRequestID'
                        columns={columnPendings}
                        dataSource={filteredPendings.map(emp => ({ ...emp, key: emp.LeaveRequestID }))}
                        onRow={(record) => ({
                            onDoubleClick: () => showModal(record),
                        })}
                        bordered
                        size='medium'
                        scroll={{
                            x: 'max-content',
                            y: 51.5 * 4,
                        }}
                        pagination={false}
                    />
                </>
            )}
        </>
    )
}

export default LeaveList