import { Button, Flex, Space, Table, Typography } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { FileExcelOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import exportToExcel from '../../utils/exportToExcel';
import dayjs from 'dayjs';
import { UserContext } from '../../api/UserContext';

const ResignationList = ({ resignations, employees, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [newResignations, setNewResignations] = useState([]);
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
    const workEmail = user?.email;

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    useEffect(() => {
        if (role === 'manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const newEmployees = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            const relatedEmployeeIDs = newEmployees.map(dv => dv.EmployeeID);
            const filtered = resignations.filter(emp => relatedEmployeeIDs.includes(emp.EmployeeID));
            setNewResignations(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const dataSource = role === 'manager' && newResignations.length > 0 ? newResignations : resignations;

    const filteredResignations = dataSource.filter(res =>
        res.EmployeeID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employees.find(e => e.EmployeeID === res.EmployeeID)?.FullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 115,
            align: 'left',
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
            title: 'LÝ DO NGHỈ VIỆC',
            dataIndex: 'Reason',
            minWidth: 119,
            align: 'left',
        },
        {
            title: 'NGÀY NGHỈ VIỆC',
            dataIndex: 'ResignationsDate',
            align: 'center',
            minWidth: 132,
            sorter: (a, b) => new Date(a.ResignationsDate) - new Date(b.ResignationsDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
    ];

    const handleExportResignations = () => {
        const columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'MÃ NHÂN VIÊN', key: 'EmployeeID', width: 20 },
            { header: 'TÊN NHÂN VIÊN', key: 'FullName', width: 25 },
            { header: 'LÝ DO NGHỈ VIỆC', key: 'Reason', width: 30 },
            { header: 'NGÀY NGHỈ VIỆC', key: 'ResignationsDate', width: 15, isDate: true }
        ];

        const data = filteredResignations.map((res) => {
            const employee = employees.find(emp => emp.EmployeeID === res.EmployeeID);
            return {
                EmployeeID: res.EmployeeID,
                FullName: employee ? employee.FullName : '',
                Reason: res.Reason,
                ResignationsDate: res.ResignationsDate
            };
        });

        exportToExcel(data, columns, 'DanhSachNghiViec');
    };

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredResignations.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    <Button type="primary" onClick={handleExportResignations} icon={<FileExcelOutlined />}>
                        File excel
                    </Button>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                rowKey='ID_Resignation'
                columns={columns}
                dataSource={filteredResignations.map(emp => ({ ...emp, key: emp.ID_Resignation }))}
                onRow={(record) => ({
                    onDoubleClick: () => showModal(record),
                })}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
            />
        </>
    )
}

export default ResignationList