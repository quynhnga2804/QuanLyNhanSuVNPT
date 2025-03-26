import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';

const DepartmentList = ({ departments, divisions }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();

    const uniqueDivisionIDs = [...new Set(departments.map(emp => emp.DivisionID))];

    const handleEdit = (record) => {
        setEditingDepartment(record);
        editForm.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/departments/${editingDepartment.DepartmentID}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchEmployees();
            message.success('Chỉnh sửa thành công!');
            handleCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa nhân sự ${record.DepartmentName} (Mã: ${record.DepartmentID}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/departments/${record.DepartmentID}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(`Xóa nhân sự ${record.DepartmentName} thành công!`);
                    fetchEmployees();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const columns = [
        {
            title: 'MÃ PHÒNG BAN',
            dataIndex: 'DepartmentID',
            minWidth: 111,
            fixed: 'left',
        },
        {
            title: 'TÊN PHÒNG BAN',
            dataIndex: 'DepartmentName',
            minWidth: 80,
            align: 'left',
        },
        {
            title: 'TÊN BỘ PHẬN',
            dataIndex: 'DivisionID',
            align: 'left',
            render: (id) => {
                const division = divisions.find(dvs => dvs.DivisionID === id);
                return division ? division.DivisionsName : 'Không xác định';
            },
            filters: uniqueDivisionIDs.map(id => {
                const division = divisions.find(dep => dep.DivisionID === id);
                return division ? { text: division.DivisionName, value: division.DivisionName } : null;
            }).filter(item => item !== null),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.DivisionsName?.includes(value),
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 113,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)} style={{ border: 'none', height: '20px', width: '45px' }}>Sửa</Button>
                    <Button type="link" danger onClick={() => handleDelete(record)} style={{ border: 'none', height: '20px', width: '45px' }}>Xóa</Button>
                </>
            ),
        }
    ];

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const filteredDepartments = departments.filter(dpm =>
        dpm.DepartmentID.toLowerCase().includes(searchQuery) ||
        dpm.DepartmentName.toLowerCase().includes(searchQuery) &&
        (statusFilter ? dpm.status === statusFilter : true)
    );

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredDepartments.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    {/* <Button type='primary' onClick={handleAddNew}> */}
                    <Button type='primary'>
                        <Space>
                            Tạo mới <UserAddOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={columns}
                dataSource={filteredDepartments.map(dpm => ({ ...dpm, key: dpm.DepartmentID }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
            />
        </>
    )
}

export default DepartmentList