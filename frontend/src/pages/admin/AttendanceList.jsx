import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';

const AttendanceList = ({ attendances }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();

    const handleEdit = (record) => {
        setEditingAttendance(record);
        editForm.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

    const handleAddNew = () => {
        setIsAddModalOpen(true);
    };

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa chấm công ngày ${record.AttendancesDate} không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/attendances/${record.ID_Attendance}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(`Xóa nhân sự ${record.AttendancesDate} thành công!`);
                    fetchAttendances();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/attendances', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchAttendances();
            message.success('Thêm mới nhân sự thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/attendances/${editingAttendance.ID_Attendance}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchAttendances();
            message.success('Chỉnh sửa thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const columns = [
        {
            title: 'MÃ',
            dataIndex: 'ID_Attendance',
            fixed: 'left',
            align: 'center',
        },
        {
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            align: 'center',
            minWidth: 72,
            filterSearch: true,
        },
        {
            title: 'NGÀY CHẤM CÔNG',
            dataIndex: 'AttendancesDate',
            minWidth: 79,
            align: 'center',
        },
        {
            title: 'GIỜ VÀO',
            dataIndex: 'CheckInTime',
            minWidth: 64,
            align: 'center',
            filterSearch: true,
        },
        {
            title: 'GIỜ RA',
            dataIndex: 'CheckOutTime',
            minWidth: 64,
            align: 'center',
        },
        {
            title: 'TỔNG GIỜ LÀM',
            dataIndex: 'TotalHoursWorked',
            minWidth: 98,
            align: 'center',
            filterSearch: true,
        },
        {
            title: 'MÃ CHU KỲ',
            dataIndex: 'ID_PayrollCycle',
            minWidth: 64,
            align: 'center',
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 93,
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

    const filteredAttendances = attendances.filter(ate =>
        ate.AttendancesDate.toLowerCase().includes(searchQuery) &&
        (statusFilter ? ate.status === statusFilter : true)
    );

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredAttendances.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    <Button type='primary' onClick={handleAddNew}>
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
                dataSource={filteredAttendances.map(ate => ({ ...ate, key: ate.ID_Attendance }))}
                bordered
                size='small'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
            />

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh sửa thông tin bộ phận</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Mã bộ phận' name='DivisionID'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Tên bộ phận' name='DivisionsName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Thời gian thành lập' name='EstablishmentDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm mới chấm công</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Mã nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tên bộ phận' name='DivisionsName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Thời gian thành lập' name='EstablishmentDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AttendanceList;