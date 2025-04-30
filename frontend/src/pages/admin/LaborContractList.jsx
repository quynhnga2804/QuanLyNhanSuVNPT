import { Table, Button, Flex, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { put, post, del } from '../../api/apiService';

const LaborContractList = ({ laborcontracts, fetchLaborContracts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingLaborContract, setEditingLaborContract] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();

    const handleEdit = (record) => {
        setEditingLaborContract(record);
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
            await put(`/admin/laborcontracts/${editingLaborContract.ID_Contract}`, values);
            fetchLaborContracts();
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
            await post('/admin/laborcontracts', values);
            fetchLaborContracts();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Thêm mới thất bại, vui lòng kiểm tra lại!');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${record.ContractType} (Mã: ${record.ID_Contract}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/laborcontracts/${record.ID_Contract}`);
                    message.success(`Xóa ${record.ContractType} thành công!`);
                    fetchLaborContracts();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const columns = [
        {
            title: 'MÃ HỢP ĐỒNG',
            dataIndex: 'ID_Contract',
            minWidth: 30,
            fixed: 'left',
            align: 'center',
        },
        {
            title: 'LOẠI HỢP ĐỒNG',
            dataIndex: 'ContractType',
            minWidth: 80,
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

    const filteredLaborContracts = laborcontracts.filter(dvs =>
        dvs.ID_Contract.toLowerCase().includes(searchQuery) ||
        dvs.ContractType.toLowerCase().includes(searchQuery)
    );

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredLaborContracts.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Tìm kiếm...'
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
                dataSource={filteredLaborContracts.map(dvs => ({ ...dvs, key: dvs.ID_Contract }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
            />

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Loại Hợp Đồng</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Mã hợp đồng' name='ID_Contract' rules={[{ required: true, message: 'Vui lòng nhập mã hợp đồng!' }]}>
                        <Input placeholder='Ví dụ: C001' maxLength={10} />
                    </Form.Item>
                    <Form.Item label='Loại hợp đồng' name='ContractType' rules={[{ required: true, message: 'Vui lòng nhập loại hợp đồng!' }]}>
                        <Input maxLength={50} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Thông Tin</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Mã hợp đồng' name='ID_Contract'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Loại hợp đồng' name='ContractType' rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                        <Input maxLength={50} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default LaborContractList