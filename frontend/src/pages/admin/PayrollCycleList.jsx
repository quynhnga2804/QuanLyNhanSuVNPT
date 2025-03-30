import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';

const PayrollCycleList = ({ employees, jobprofiles, departments, payrollcycles, fetchPayrollCycles }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPayrollCycle, setEditingPayrollCycle] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const role = JSON.parse(localStorage.getItem('user')).role;
    const workEmail = JSON.parse(localStorage.getItem('user')).email;

    const handleEdit = (record) => {
        setEditingPayrollCycle(record);
        editForm.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/payrollcycles/${editingPayrollCycle.ID_PayrollCycle}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchPayrollCycles();
            message.success('Chỉnh sửa thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleAddNew = () => {
        setIsAddModalOpen(true);
    };

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            const token = localStorage.getItem('token');
            const payload = { ...values, Status: 'Chưa bắt đầu' };
            await axios.post('http://localhost:5000/api/admin/payrollcycles', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchPayrollCycles();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa chu kỳ ${record.PayrollName} (Mã: ${record.ID_PayrollCycle}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/payrollcycles/${record.ID_PayrollCycle}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(`Xóa ${record.PayrollName} thành công!`);
                    fetchPayrollCycles();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const columns = [
        {
            title: 'MÃ CHU KỲ',
            dataIndex: 'ID_PayrollCycle',
            minWidth: 111,
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'TÊN CHU KỲ',
            dataIndex: 'PayrollName',
            minWidth: 115,
            align: 'left',
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            align: 'center',
            minWidth: 135,
            sorter: (a, b) => new Date(a.DateOfBirth) - new Date(b.DateOfBirth),
            minWidth: 108,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'NGÀY KẾT THÚC',
            dataIndex: 'EndDate',
            minWidth: 183,
            align: 'center',
            sorter: (a, b) => new Date(a.DateOfBirth) - new Date(b.DateOfBirth),
            minWidth: 108,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            align: 'center',
            minWidth: 108,
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

    const filteredPayrollCycles = payrollcycles.filter(dvs =>
        dvs.PayrollName.toLowerCase().includes(searchQuery)
    );

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>

                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    {(role === 'Admin' || role === 'Director') &&
                        <Button type='primary' onClick={handleAddNew}>
                            <Space>
                                Tạo mới <UserAddOutlined />
                            </Space>
                        </Button>
                    }
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredPayrollCycles.map(dvs => ({ ...dvs, key: dvs.ID_PayrollCycle }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
            />

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Chu Kỳ</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Mã chu kỳ' name='ID_PayrollCycle' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tên chu kỳ' name='PayrollName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày bắt đầu' name='StartDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Ngày kết thúc' name='EndDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Chu Kỳ</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Mã chu kỳ' name='ID_PayrollCycle' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tên chu kỳ' name='PayrollName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày bắt đầu' name='StartDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Ngày kết thúc' name='EndDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Trạng thái' name='Status' rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value='Hoàn thành'>Hoàn thành</Select.Option>
                            <Select.Option value='Đang xử lý'>Đang xử lý</Select.Option>
                            <Select.Option value='Chưa bắt đầu'>Chưa bắt đầu</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PayrollCycleList