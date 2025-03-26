import { Button, Dropdown, Flex, Space, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import SideContent from './SideContent';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import dayjs from 'dayjs';

const LaborContract = ({ employeecontracts, laborcontracts, employees }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');

    const today = dayjs();
    const expiringContracts = employeecontracts.filter(emp => {
        const endDate = dayjs(emp.EndDate);
        return endDate.isAfter(today, 'day') && endDate.diff(today, 'day') <= 30;
    });
    const nowContracts = employeecontracts.filter(emp => emp.Status === 'Hoạt động');
    const uniqueIDs = [...new Set(employeecontracts.map(emp => emp.ID_Contract))];
    const uniqueStatuses = [...new Set(employeecontracts.map(emp => emp.Status))];
    const mergedContracts = employeecontracts.map(emp => {
        const contract = laborcontracts.find(lc => lc.ID_Contract === emp.ID_Contract);
        return {
            ...emp,
            ContractType: contract ? contract?.ContractType : "Không xác định", // Nếu không tìm thấy, gán mặc định
        };
    });

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const columns = [
        {
            title: 'MÃ HỢP ĐỒNG',
            dataIndex: 'ID_Contract',
            fixed: 'left',
            align: 'center',
            minWidth: 128,
            filters: uniqueIDs.map(pt => ({ text: pt, value: pt })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.ID_Contract === value,
        },
        {
            title: 'LOẠI HỢP ĐỒNG',
            dataIndex: 'ID_Contract',
            minWidth: 119,
            align: 'left',
            render: (id) => {
                const laborcontract = laborcontracts.filter(emp => emp.ID_Contract === id);
                return laborcontract ? laborcontract[0]?.ContractType : 'Không xác định';
            },
        },
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 115,
            align: 'left',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                return employee ? employee.FullName : 'Không xác định';
            },
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            align: 'right',
            minWidth: 132,
            sorter: (a, b) => new Date(a.StartDate) - new Date(b.StartDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'NGÀY KẾT THÚC',
            dataIndex: 'EndDate',
            minWidth: 140,
            align: 'right',
            sorter: (a, b) => new Date(a.EndDate) - new Date(b.EndDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            width: 115,
            align: 'right',
            render: (text) => (
                <span
                    style={{
                        color: text === 'Đã ký' ? 'green' : text === 'Hết hạn' ? 'red' : 'black',
                    }}
                >
                    {text}
                </span>
            ),
            filters: uniqueStatuses.map(pt => ({ text: pt, value: pt })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.Status === value,
        },
        {
            title: 'CHÍNH THỨC',
            dataIndex: 'ID_Contract',
            width: 98,
            align: 'center',
            render: (text, record) => (
                <input
                    type="checkbox"
                    readOnly
                    checked={text !== 3 ? true : false}
                    style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: 'green',
                        border: '2px solid green',
                    }}
                />
            ),
        },
        {
            title: 'THỬ VIỆC',
            dataIndex: 'ID_Contract',
            width: 79,
            align: 'center',
            render: (text, record) => (
                <input
                    type="checkbox"
                    readOnly
                    checked={text === 3 ? true : false}
                    style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: 'green',
                        border: '2px solid green',
                    }}
                />
            ),
        },
        {
            dataIndex: 'edit',
            width: 50,
            align: 'center',
            fixed: 'right',
            render: () => (
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            Sửa <CaretDownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            ),
        }
    ];

    const filteredEmployeeContracts = mergedContracts.filter(emp =>
        emp.Status.toLowerCase().includes(searchQuery)
        || emp.ID_Contract.toString().includes(searchQuery)
        || emp.ContractType.toLowerCase().includes(searchQuery.toLowerCase())
        && (statusFilter ? emp.status === statusFilter : true)
    );

    const menuProps = {
        items: [
            {
                key: '1',
                label: 'Chỉnh sửa',
            },
            {
                key: '2',
                label: 'Tải lên file mới',
            },
            {
                key: '3',
                label: 'Tạo file từ file mẫu',
            },
            {
                key: '4',
                label: 'Đánh dấu hợp đồng gần nhất',
            },
            {
                key: '5',
                label: 'Gửi lại email',
            },
            {
                key: '6',
                label: 'Xem hồ sơ nhân sự',
            },
            {
                type: 'divider',
            },
            {
                key: '7',
                label: 'Xóa',
            },
        ],
    };


    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px' }}>

                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder='Tìm hợp đồng'
                            allowClear
                        />
                    </Space>

                    <Button type='primary'>
                        <Space>
                            Tạo mới <CaretDownOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>
            <div style={{ display: 'flex' }}>
                <Flex vertical style={{ width: '70%' }}>
                    <Table
                        className='table_HD'
                        columns={columns}
                        dataSource={filteredEmployeeContracts.map((item) => ({ ...item, key: `${item.ID_Contract}-${item.EmployeeID}`, }))}
                        bordered
                        size='middle'
                        scroll={{
                            x: 'max-content',
                            y: 52.5 * 10,
                        }}
                        pagination={false}
                        onChange={onChange}
                    />
                </Flex>
                <SideContent nowContracts={nowContracts} expiringContracts={expiringContracts} />
            </div>
        </>
    )
}

export default LaborContract