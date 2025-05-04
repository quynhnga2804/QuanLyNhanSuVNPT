import { Table, Button, Flex, Space, Typography, Modal, Form, Input, message, DatePicker } from 'antd';
import React, { useState } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { put, post, del } from '../../api/apiService';

const DivisionList = ({ divisions, fetchDivisions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDivision, setEditingDivision] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();

    const handleEdit = (record) => {
        setEditingDivision(record);
        editForm.setFieldsValue({
            ...record,
            EstablishmentDate: record.EstablishmentDate ? dayjs(record.EstablishmentDate, 'YYYY-MM-DD') : null,
        });
        setIsEditModalOpen(true);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            if (values.DivisionsName.trim() === '') {
                message.error(`Trường 'Tên bộ phận' không được để khoảng trắng!`);
                return;
            }
            values.DivisionsName = values.DivisionsName.trim();
            await put(`/admin/divisions/${editingDivision.DivisionID}`, values);
            fetchDivisions();
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

    const fieldTitles = {
        DivisionID: 'Mã bộ phận',
        DivisionsName: 'Tên bộ phận',
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();

            for (const key in values) {
                const value = values[key];
                if (typeof value === 'string') {
                    if (value.trim() === '') {
                        const fieldTitle = fieldTitles[key] || key;
                        message.error(`Trường '${fieldTitle}' không được để khoảng trắng!`);
                        return;
                    }
                    values[key] = value.trim();
                }
            }

            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key] || '');
            });

            await post('/admin/divisions', values);
            fetchDivisions();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${record.DivisionsName} (Mã: ${record.DivisionID}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/divisions/${record.DivisionID}`);
                    message.success(`Xóa ${record.DivisionsName} thành công!`);
                    fetchDivisions();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const columns = [
        {
            title: 'MÃ BỘ PHẬN',
            dataIndex: 'DivisionID',
            minWidth: 111,
            fixed: 'left',
        },
        {
            title: 'TÊN BỘ PHẬN',
            dataIndex: 'DivisionsName',
            minWidth: 80,
            align: 'left',
        },
        {
            title: 'NGÀY THÀNH LẬP',
            dataIndex: 'EstablishmentDate',
            align: 'center',
            sorter: (a, b) => new Date(a.EstablishmentDate) - new Date(b.EstablishmentDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
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

    const filteredDivisions = divisions.filter(dvs =>
        dvs.DivisionID.toLowerCase().includes(searchQuery) ||
        dvs.DivisionsName.toLowerCase().includes(searchQuery)
    );

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredDivisions.length}
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
                columns={columns}
                dataSource={filteredDivisions.map(dvs => ({ ...dvs, key: dvs.DivisionID }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
            />

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Bộ Phận</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Mã bộ phận' name='DivisionID' rules={[{ required: true, message: 'Vui lòng nhập mã bộ phận!' }]}>
                        <Input placeholder='Ví dụ: D001' maxLength={10} />
                    </Form.Item>
                    <Form.Item label='Tên bộ phận' name='DivisionsName' rules={[{ required: true, message: 'Vui lòng nhập tên bộ phận!' }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item label='Thời gian thành lập' name='EstablishmentDate' rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
                        <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} placeholder='Chọn ngày' />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Thông Tin</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Mã bộ phận' name='DivisionID'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Tên bộ phận' name='DivisionsName' rules={[{ required: true, message: 'Vui lòng nhập tên bộ phận!' }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item label='Thời gian thành lập' name='EstablishmentDate' rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} placeholder='Chọn ngày' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DivisionList