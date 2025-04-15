import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import axios from 'axios';
import { UserContext } from '../../api/UserContext';
import { put, post, del } from '../../api/apiService';

const PersonalProfile = ({ employees, fetchPersonalProfiles, personalprofiles, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPersonalProfile, setEditingPersonalProfile] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const [newPersonalProfiles, setNewPersonalProfiles] = useState([]);
    const [tableFilters, setTableFilters] = useState({});

    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
    const workEmail = user?.email;

    const uniqueEducations = [...new Set(personalprofiles.map(per => per.Education).filter(Boolean))];

    const handleEdit = (record) => {
        setEditingPersonalProfile(record);
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
            await put(`/admin/personalprofiles/${editingPersonalProfile.EmployeeID}`, values);
            fetchPersonalProfiles();
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
            await post('/admin/personalprofiles', values);
            fetchPersonalProfiles();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa hồ sơ mã ${record.EmployeeID} không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/personalprofiles/${record.EmployeeID}`);
                    message.success(`Xóa ${record.EmployeeID} thành công!`);
                    fetchPersonalProfiles();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    useEffect(() => {
        if (role === 'manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const newEmployees = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            const relatedEmployeeIDs = newEmployees.map(dv => dv.EmployeeID);
            const filtered = personalprofiles.filter(emp => relatedEmployeeIDs.includes(emp.EmployeeID));
            setNewPersonalProfiles(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const columns = [
        {
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 110,
            fixed: 'left',
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
            title: 'QUỐC TỊCH',
            dataIndex: 'Nationality',
            align: 'left',
            minWidth: 90,
        },
        {
            title: 'QUÊ QUÁN',
            dataIndex: 'PlaceOfBirth',
            minWidth: 90,
            align: 'left',
        },
        {
            title: 'SỐ SỔ BẢO HIỂM',
            dataIndex: 'InsurancesNumber',
            minWidth: 123,
            align: 'right',
        },
        {
            title: 'MÃ ĐỊNH DANH',
            dataIndex: 'ID_Card',
            align: 'right',
            minWidth: 113,
        },
        {
            title: 'NƠI CẤP',
            dataIndex: 'ID_CardIssuedPlace',
            minWidth: 90,
            align: 'left',
        },
        {
            title: 'HỌC VẤN',
            dataIndex: 'Education',
            minWidth: 90,
            align: 'right',
            filters: uniqueEducations.map(ed => ({ text: ed, value: ed })),
            filterMode: 'tree',
        },
        {
            title: 'BẰNG CẤP',
            dataIndex: 'Degree',
            minWidth: 90,
            align: 'right',
        },
        {
            title: 'CHUYÊN NGÀNH',
            dataIndex: 'Major',
            minWidth: 133,
            align: 'right',
        },
        {
            title: 'KINH NGHIỆM LÀM VIỆC',
            dataIndex: 'WorkExperience',
            align: 'right',
            minWidth: 157,
        },
        {
            title: 'MÃ SỐ THUẾ',
            dataIndex: 'TaxCode',
            minWidth: 100,
            align: 'center',
        },
        {
            title: 'SỐ TÀI KHOẢN',
            dataIndex: 'BankAccount',
            minWidth: 113,
            align: 'center',
        },
        {
            title: 'TÊN NGÂN HÀNG',
            dataIndex: 'BankName',
            align: 'right',
            minWidth: 124,
        },
        {
            title: 'TÌNH TRẠNG HÔN NHÂN',
            dataIndex: 'MaritalStatus',
            align: 'right',
            minWidth: 165,
        },
    ];

    if (role === 'director' || role === 'admin') {
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

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    const dataSource = role === 'manager' && newPersonalProfiles.length > 0 ? newPersonalProfiles : personalprofiles;
    const filteredpersonalprofiles = dataSource.filter(dvs => {
        const matchesSearchQuery = searchQuery === '' ||
            dvs.EmployeeID.toLowerCase().includes(searchQuery) ||
            dvs.Nationality.toLowerCase().includes(searchQuery) ||
            dvs.PlaceOfBirth.toLowerCase().includes(searchQuery) ||
            dvs.InsurancesNumber.toLowerCase().includes(searchQuery) ||
            dvs.ID_Card.toLowerCase().includes(searchQuery) ||
            dvs.Degree.toLowerCase().includes(searchQuery) ||
            dvs.Major.toLowerCase().includes(searchQuery) ||
            employees.find(e => e.EmployeeID === dvs.EmployeeID)?.FullName.toLowerCase().includes(searchQuery);

        const selectedEducation = tableFilters.Education || [];
        const matchesEducationFilter = selectedEducation.length === 0 || selectedEducation.includes(dvs.Education);

        return matchesSearchQuery && matchesEducationFilter;
    }).map(dvs => ({ ...dvs, key: dvs.EmployeeID }));

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredpersonalprofiles.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    {(role === 'admin' || role === 'director') &&
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
                dataSource={filteredpersonalprofiles.map(dvs => ({ ...dvs, key: dvs.EmployeeID }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
                onChange={handleTableChange}
            />

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Hồ Sơ Cá Nhân</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Tên nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Select placeholder="Chọn nhân viên">
                            {employees.filter(emp => !personalprofiles.some(profile => profile.EmployeeID === emp.EmployeeID)).map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    {emp.FullName} ({emp.EmployeeID})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Quốc tịch' name='Nationality' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Quê quán' name='PlaceOfBirth' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Số sổ bảo hiểm' name='InsurancesNumber'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Mã định danh' name='ID_Card' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Nơi cấp' name='ID_CardIssuedPlace' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Học vấn' name='Education' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Bằng cấp' name='Degree' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Chuyên ngành' name='Major' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Kinh nghiệm làm việc' name='WorkExperience'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Mã số thuế' name='TaxCode' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Số tài khoản ngân hàng' name='BankAccount' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tên ngân hàng' name='BankName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tình trạng hôn nhân' name='MaritalStatus'>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Hồ Sơ</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Tên nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Select placeholder="Chọn nhân viên">
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    {emp.FullName} ({emp.EmployeeID})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Quốc tịch' name='Nationality' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Quê quán' name='PlaceOfBirth' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Số sổ bảo hiểm' name='InsurancesNumber'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Mã định danh' name='ID_Card' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Nơi cấp' name='ID_CardIssuedPlace' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Học vấn' name='Education' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Bằng cấp' name='Degree' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Chuyên ngành' name='Major' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Kinh nghiệm làm việc' name='WorkExperience'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Mã số thuế' name='TaxCode' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Số tài khoản ngân hàng' name='BankAccount' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tên ngân hàng' name='BankName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Tình trạng hôn nhân' name='MaritalStatus'>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PersonalProfile