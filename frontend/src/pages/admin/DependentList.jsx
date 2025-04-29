import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { UserContext } from '../../api/UserContext';
import { put, post, del } from '../../api/apiService';

const DependentList = ({ employees, familyMembers, fetchFamilyMembers }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingFamilyMember, setEditingFamilyMember] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();

    const handleEdit = (record) => {
        setEditingFamilyMember(record);
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
            content: `Bạn có chắc chắn muốn xóa ${record.FullName} không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/familymembers/${record.FamilyMemberID}`);
                    message.success(`Xóa phụ thuộc ${record.FullName} thành công!`);
                    fetchFamilyMembers();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            await post('/admin/familymembers', values);
            fetchFamilyMembers();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            await put(`/admin/familymembers/${editingFamilyMember.FamilyMemberID}`, values);
            fetchFamilyMembers();
            message.success('Chỉnh sửa thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

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
            align: 'left',
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                return employee ? employee.FullName : '';
            },
        },
        {
            title: 'TÊN NGƯỜI THÂN',
            dataIndex: 'FullName',
            minWidth: 80,
            align: 'left',
        },
        {
            title: 'MỐI QUAN HỆ',
            dataIndex: 'Relationship',
            align: 'center',
            minWidth: 70,
        },
        {
            title: 'NGÀY SINH',
            dataIndex: 'DateOfBirth',
            minWidth: 80,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'GIỚI TÍNH',
            dataIndex: 'Gender',
            align: 'center',
            minWidth: 60,
        },
        {
            title: 'ĐỊA CHỈ',
            dataIndex: 'Address',
            align: 'left',
        },
        {
            title: 'SĐT',
            dataIndex: 'PhoneNumber',
            align: 'center',
        },
    ];

    if (role === 'hr') {
        columns.push({
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 113,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)} style={{ border: 'none', height: '20px', width: '45px' }}><EditOutlined /></Button>
                    <Button type="link" danger onClick={() => handleDelete(record)} style={{ border: 'none', height: '20px', width: '45px' }}><DeleteOutlined /></Button>
                </>
            ),
        });
    }

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const filteredDivisions = familyMembers.filter(fam =>
        employees.find(emp => emp.EmployeeID === fam.EmployeeID)?.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fam.FullName.toLowerCase().includes(searchQuery)
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
                    
                    {role === 'hr' && (
                        <Button type='primary' onClick={handleAddNew}>
                            <Space>
                                Tạo mới <UserAddOutlined />
                            </Space>
                        </Button>
                    )}
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredDivisions.map(dvs => ({ ...dvs, key: dvs.familyMemberID }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 51.7 * 9,
                }}
                pagination={false}
            />

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh sửa thông tin bộ phận</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Tên nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Select>
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    ({emp.EmployeeID}) {emp.FullName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tên người thân" name="FullName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mối quan hệ" name="Relationship" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="DateOfBirth">
                        <Input type='Date' />
                    </Form.Item>
                    <Form.Item label='Giới tính' name='Gender'>
                        <Select>
                            <Select.Option value='Nam'>Nam</Select.Option>
                            <Select.Option value='Nữ'>Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="PhoneNumber">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Tên nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Select>
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    ({emp.EmployeeID}) {emp.FullName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tên người thân" name="FullName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mối quan hệ" name="Relationship" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="DateOfBirth">
                        <Input type='Date' />
                    </Form.Item>
                    <Form.Item label='Giới tính' name='Gender'>
                        <Select>
                            <Select.Option value='Nam'>Nam</Select.Option>
                            <Select.Option value='Nữ'>Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="PhoneNumber">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DependentList