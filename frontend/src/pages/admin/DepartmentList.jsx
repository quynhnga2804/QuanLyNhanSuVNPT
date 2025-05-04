import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import axios from 'axios';
import { UserContext } from '../../api/UserContext';
import { put, post, del } from '../../api/apiService';

const DepartmentList = ({ departments, employees, divisions, fetchDepartments }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const [newJobDepartments, setNewDepartments] = useState([]);
    const [tableFilters, setTableFilters] = useState({});
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
    const workEmail = user?.email;

    const uniqueDivisionIDs = [...new Set(departments.map(emp => emp.DivisionID))];

    const handleEdit = (record) => {
        setEditingDepartment(record);
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
            if (values.DepartmentName.trim() === '') {
                message.error(`Trường 'Tên phòng ban' không được để khoảng trắng!`);
                return;
            }
            values.DepartmentName = values.DepartmentName.trim();
            await put(`/admin/departments/${editingDepartment.DepartmentID}`, values);
            fetchDepartments();
            message.success('Chỉnh sửa thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${record.DepartmentName} (Mã: ${record.DepartmentID}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/departments/${record.DepartmentID}`);
                    message.success(`Xóa ${record.DepartmentName} thành công!`);
                    fetchDepartments();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handleAddNew = () => {
        setIsAddModalOpen(true);
    };

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const fieldTitles = {
        DepartmentID: 'Mã phòng ban',
        DepartmentName: 'Tên phòng ban',
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

            await post('/admin/departments', formData);
            fetchDepartments();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Lỗi xử lý dữ liệu, vui lòng kiểm tra lại!');
        }
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
                return division ? division.DivisionsName : '';
            },
            filters: uniqueDivisionIDs.map(id => {
                const division = divisions.find(dep => dep.DivisionID === id);
                return division ? { text: division?.DivisionsName, value: division?.DivisionID } : null;
            }).filter(item => item !== null),
            filterMode: 'tree',
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

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    useEffect(() => {
        if (role === 'manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const filtered = departments.filter(dv => dv.DivisionID === dvID);
            setNewDepartments(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const dataSource = role === 'manager' && newJobDepartments.length > 0 ? newJobDepartments : departments;
    const filteredDepartments = dataSource.filter(dpm => {
        const matchesSearchQuery = searchQuery === '' ||
            dpm.DepartmentID.toLowerCase().includes(searchQuery) ||
            dpm.DepartmentName.toLowerCase().includes(searchQuery);

        const selectedDivisionID = tableFilters.DivisionID || [];
        const matchesDivisionIDFilter = selectedDivisionID.length === 0 || selectedDivisionID.includes(dpm.DivisionID);

        return matchesSearchQuery && matchesDivisionIDFilter;
    });

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
                dataSource={filteredDepartments.map(dpm => ({ ...dpm, key: dpm.DepartmentID }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
                onChange={handleTableChange}
            />

            {/* Thêm mới phòng ban */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Phòng Ban</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered >
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Mã phòng ban' name='DepartmentID' rules={[{ required: true, message: 'Vui lòng nhập mã phòng ban!' }]}>
                        <Input maxLength={10} placeholder='Ví dụ: DEP01' />
                    </Form.Item>
                    <Form.Item label='Tên phòng ban' name='DepartmentName' rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban!' }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item label='Tên bộ phận' name='DivisionID' rules={[{ required: true, message: 'Vui lòng chọn bộ phận!' }]}>
                        <Select>
                            {divisions.map(divs => (
                                <Select.Option key={divs.DivisionID} value={divs.DivisionID}>{divs.DivisionsName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa phòng ban */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Phòng Ban</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Mã phòng ban' name='DepartmentID' rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                        <Input disabled maxLength={10} />
                    </Form.Item>
                    <Form.Item label='Tên phòng ban' name='DepartmentName' rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item label='Tên bộ phận' name='DivisionID' rules={[{ required: true, message: 'Vui lòng chọn bộ phận!' }]}>
                        <Select>
                            {divisions.map(divs => (
                                <Select.Option key={divs.DivisionID} value={divs.DivisionID}>{divs.DivisionsName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default DepartmentList