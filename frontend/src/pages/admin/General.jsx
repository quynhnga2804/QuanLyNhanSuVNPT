import { Table, Button, Descriptions, Upload, Flex, Select, Space, Typography, Modal, Form, Input, message, Image } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { UserContext } from '../../api/UserContext';
import { put, post, del } from '../../api/apiService';

const General = ({ employees, departments, users, fetchEmployees, fetchUsers, employeecontracts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newEmployees, setNewEmployees] = useState([]);
    const [tableFilters, setTableFilters] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm] = Form.useForm();

    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
    const workEmail = user?.email;

    const uniqueGenders = [...new Set(employees.map(emp => emp.Gender).filter(Boolean))];
    const uniquePositions = [...new Set(employees.map(emp => emp.Position).filter(Boolean))];
    const uniqueDepartmentIDs = [...new Set(employees.map(emp => emp.DepartmentID).filter(Boolean))];

    const userAccount = users.find(user => user.WorkEmail === selectedEmployee?.WorkEmail);

    const showModal = (record) => {
        setSelectedEmployee(record);
        setIsShowModalOpen(true);
    };

    const closeModal = () => {
        setIsShowModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleEdit = (record) => {
        setPreviewImage(`http://localhost:5000/uploads/${record.Image}`);
        editForm.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setPreviewImage(null);
        editForm.resetFields();
    };

    const handleEditSave = async (form, selectedImage) => {
        try {
            const values = await form.validateFields();
            for (let key in values) {
                const requiredFields = ['EmployeeID', 'FullName', 'PhoneNumber', 'DepartmentID', 'JobTitle', 'Position', 'StartDate'];

                if (requiredFields.includes(key)) {
                    const value = values[key];

                    if (typeof value === 'string') {
                        if (value.trim() === '') {
                            const fieldTitle = fieldTitles[key] || key;
                            message.error(`Trường "${fieldTitle}" không được để khoảng trắng!`);
                            return;
                        }
                        values[key] = value.trim();
                    }
                }
            }
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key] || '');
            });

            if (selectedImage)
                formData.append('Image', selectedImage);

            await put(`/admin/employees/${values.EmployeeID}`, formData);

            fetchEmployees();
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
        setPreviewImage(null);
        addForm.resetFields();
    };

    const fieldTitles = {
        EmployeeID: 'Mã nhân viên',
        FullName: 'Họ và tên',
        PhoneNumber: 'Số điện thoại',
        JobTitle: 'Chức danh',
        Position: 'Chức vụ',
        StartDate: 'Ngày bắt đầu',
        DepartmentID: 'Phòng ban',
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            for (let key in values) {
                const requiredFields = ['EmployeeID', 'FullName', 'PhoneNumber', 'DepartmentID', 'JobTitle', 'Position', 'StartDate'];

                if (requiredFields.includes(key)) {
                    const value = values[key];

                    if (typeof value === 'string') {
                        if (value.trim() === '') {
                            const fieldTitle = fieldTitles[key] || key;
                            message.error(`Trường "${fieldTitle}" không được để khoảng trắng!`);
                            return;
                        }
                        values[key] = value.trim();
                    }
                }
            }
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key] || '');
            });

            if (selectedImage) {
                formData.append('Image', selectedImage);
            }

            await post('/admin/employees', formData);
            fetchEmployees();
            message.success('Thêm mới nhân sự thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa nhân sự ${record.FullName} (Mã: ${record.EmployeeID}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/employees/${record.EmployeeID}`);
                    message.success(`Xóa nhân sự ${record.FullName} thành công!`);
                    fetchEmployees();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handleCreateAccountOpen = () => {
        createForm.setFieldsValue({
            UserName: selectedEmployee?.FullName || '',
            Password: '',
            Role: 'employee',
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateAccountCancel = () => {
        setIsCreateModalOpen(false);
        addForm.resetFields();
    };

    const handleCreateAccountSave = async () => {
        try {
            const values = await createForm.validateFields();
            values.WorkEmail = selectedEmployee?.WorkEmail || '';
            const response = await post('/admin/users/create', values);
            if (response.status === 200 || response.status === 201) {
                fetchUsers();
                message.success('Tạo tài khoản thành công!');
                handleCreateAccountCancel();
            } else {
                message.error('Lỗi khi tạo tài khoản!');
            }
        } catch (error) {
            message.error('Lỗi kết nối server!');
        }
    };

    const handleViewAccount = (user) => {
        Modal.info({
            title: 'Thông Tin Tài Khoản',
            content: (
                <div>
                    <p><b>WorkEmail:</b> {user.WorkEmail}</p>
                    <p><b>Username:</b> {user.UserName}</p>
                    <p><b>Role:</b> {user.Role}</p>
                </div>
            ),
            footer: [
                <Button style={{ float: 'right', marginLeft: '15px' }} key="reset" type="primary" onClick={() => handleResetPassword(user.UserID)}>
                    Cấp lại mật khẩu
                </Button>,
                <Button style={{ float: 'right' }} key="close" onClick={() => Modal.destroyAll()}>
                    Đóng
                </Button>,
            ],
        });
    };

    const handleDeleteAccount = async (email) => {
        Modal.confirm({
            title: 'Xác nhận xóa tài khoản',
            content: `Bạn có chắc chắn muốn xóa tài khoản của nhân viên này không?\nHành động này không thể hoàn tác!`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    const response = await del(`/admin/users/delete/${email}`);

                    if (response.status === 200) {
                        message.success('Xóa tài khoản thành công!');
                        fetchUsers();
                    } else {
                        message.error('Lỗi khi xóa tài khoản!');
                    }
                } catch (error) {
                    message.error('Lỗi kết nối server!');
                }
            },
            onCancel: () => {
                message.info('Hủy xóa tài khoản!');
            },
        });
    };

    const handleResetPassword = async (id) => {
        Modal.confirm({
            title: 'Xác nhận cấp lại mật khẩu',
            content: `Bạn có chắc chắn muốn cấp lại mật khẩu cho nhân viên này không?`,
            okText: 'Tiếp tục',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await post(`/admin/reset-password/${id}`);
                    message.success('Đã cấp lại mật khẩu và gửi email!');
                } catch (error) {
                    message.error('Không thể cấp lại mật khẩu!');
                }
            },
            onCancel: () => {
                message.info('Hủy cấp lại mật khẩu!');
            },
        });
    };


    useEffect(() => {
        if (role === 'manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const filtered = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            setNewEmployees(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const dataSource = role === 'manager' ? newEmployees : employees;
    const filteredEmployees = dataSource.filter(emp => {
        const matchesSearchQuery = searchQuery === '' ||
            emp.FullName.toLowerCase().includes(searchQuery) ||
            emp.EmployeeID.toLowerCase().includes(searchQuery) ||
            emp.Address.toLowerCase().includes(searchQuery) ||
            emp.PhoneNumber.includes(searchQuery);

        const selectedGender = tableFilters.Gender || [];
        const selectedPosition = tableFilters.Position || [];
        const selectedDepartmentID = tableFilters.DepartmentID || [];

        const matchesGenderFilter = selectedGender.length === 0 || selectedGender.includes(emp.Gender);
        const matchesPositionFilter = selectedPosition.length === 0 || selectedPosition.includes(emp.Position);
        const matchesDepartmentFilter = selectedDepartmentID.length === 0 || selectedDepartmentID.includes(emp.DepartmentID);

        return matchesSearchQuery && matchesGenderFilter && matchesPositionFilter && matchesDepartmentFilter;
    });

    const columns = [
        {
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 111,
            fixed: 'left',
        },
        {
            title: 'HÌNH ẢNH',
            dataIndex: 'Image',
            minWidth: 80,
            align: 'center',
            render: (imageUrl) => {
                const imageSrc = imageUrl ? `http://localhost:5000/uploads/${imageUrl}` : '/default-avatar.png';
                return <Image src={imageSrc} alt='Ảnh' style={{
                    width: 34, height: 34, borderRadius: '50%', border: '1px solid lightgray', objectFit: 'cover', margin: '-2px 0'
                }} />;
            },
        },
        {
            title: 'HỌ VÀ TÊN',
            dataIndex: 'FullName',
        },
        {
            title: 'ĐIỆN THOẠI',
            dataIndex: 'PhoneNumber',
            minWidth: 92,
            align: 'center',
        },
        {
            title: 'NGÀY SINH',
            dataIndex: 'DateOfBirth',
            sorter: (a, b) => new Date(a.DateOfBirth) - new Date(b.DateOfBirth),
            minWidth: 108,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'GIỚI TÍNH',
            dataIndex: 'Gender',
            minWidth: 95,
            align: 'center',
            filters: uniqueGenders.map(gd => ({ text: gd, value: gd })),
            filterMode: 'tree',
        },
        {
            title: 'ĐỊA CHỈ',
            dataIndex: 'Address',
            minWidth: 80,
        },
        {
            title: 'EMAIL CÁ NHÂN',
            dataIndex: 'PersonalEmail',
            minWidth: 120,
        },
        {
            title: 'EMAIL CÔNG VIỆC',
            dataIndex: 'WorkEmail',
            minWidth: 120,
        },
        {
            title: 'CHỨC DANH',
            dataIndex: 'JobTitle',
            minWidth: 110,
        },
        {
            title: 'CHỨC VỤ',
            dataIndex: 'Position',
            minWidth: 110,
            filters: uniquePositions.map(pt => ({ text: pt, value: pt })),
            filterMode: 'tree',
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            minWidth: 114,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'PHÒNG BAN',
            dataIndex: 'DepartmentID',
            minWidth: 95,
            align: 'left',
            render: (id) => {
                const department = departments.find(dept => dept.DepartmentID === id);
                return department ? department.DepartmentName : '';
            },
            filters: departments.filter(dept => uniqueDepartmentIDs.includes(dept.DepartmentID)).map(dept => ({
                text: dept.DepartmentName,
                value: dept.DepartmentID
            })),
            filterMode: 'tree',
        },
    ];

    if (role !== 'manager') {
        columns.push({
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 106,
            render: (_, record) => (
                <>
                    <Button type='link' onClick={() => handleEdit(record)} style={{ border: 'none', height: '20px', width: '40px' }} ><EditOutlined /></Button>
                    <Button type='link' danger onClick={() => handleDelete(record)} style={{ border: 'none', height: '20px', width: '40px' }} ><DeleteOutlined /></Button>
                </>
            ),
        });
    }

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredEmployees.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    {role !== 'manager' && (
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
                rowKey='EmployeeID'
                columns={columns}
                dataSource={filteredEmployees.map(emp => ({ ...emp, key: emp.EmployeeID }))}
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
                onChange={handleTableChange}
            />


            {/* Chi tiết nhân sự */}
            <Modal title={<div style={{ textAlign: 'center', width: '100%' }}>Chi Tiết Nhân Sự</div>} open={isShowModalOpen} onCancel={closeModal} footer={null} width={750} centered>
                {selectedEmployee && (
                    <Descriptions column={2} size='small'>
                        <Descriptions.Item>
                            <Image
                                src={selectedEmployee.Image ? `http://localhost:5000/uploads/${selectedEmployee.Image}` : '/default-avatar.png'}
                                alt='Ảnh'
                                width={170}
                                height={170}
                                style={{
                                    borderRadius: '50%',
                                    border: '1px solid lightgray',
                                    objectFit: 'cover',
                                    display: 'block',
                                    marginBottom: '10px',
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item>
                            {userAccount ? (
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                                    <Button type='primary' onClick={() => handleViewAccount(userAccount)}>Xem Tài Khoản</Button>
                                    <Button type='danger' onClick={() => handleDeleteAccount(userAccount.UserID)}>Xóa Tài Khoản</Button>
                                </div>
                            ) : (
                                <Button type='primary' style={{ display: 'block', margin: '10px auto' }} onClick={handleCreateAccountOpen}>
                                    Tạo Tài Khoản
                                </Button>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label='Mã Nhân Viên'>
                            {selectedEmployee.EmployeeID}
                        </Descriptions.Item>
                        <Descriptions.Item label='Chức Danh'>
                            {selectedEmployee.JobTitle}
                        </Descriptions.Item>

                        <Descriptions.Item label='Họ và Tên'>
                            {selectedEmployee.FullName}
                        </Descriptions.Item>
                        <Descriptions.Item label='Chức vụ'>
                            {selectedEmployee.Position}
                        </Descriptions.Item>

                        <Descriptions.Item label='Ngày Sinh'>
                            {selectedEmployee.DateOfBirth ? dayjs(selectedEmployee.DateOfBirth).format('DD-MM-YYYY') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='Ngày Bắt Đầu'>
                            {selectedEmployee.StartDate ? dayjs(selectedEmployee.StartDate).format('DD-MM-YYYY') : ''}
                        </Descriptions.Item>

                        <Descriptions.Item label='Số Điện Thoại'>
                            {selectedEmployee.PhoneNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label='Email Cá Nhân'>
                            {selectedEmployee.PersonalEmail}
                        </Descriptions.Item>

                        <Descriptions.Item label='Phòng Ban'>
                            {departments.find((dept) => dept.DepartmentID === selectedEmployee.DepartmentID)?.DepartmentName || 'Không xác định'}
                        </Descriptions.Item>
                        <Descriptions.Item label='Email Công Việc'>
                            {selectedEmployee.WorkEmail}
                        </Descriptions.Item>

                        <Descriptions.Item label='Trạng Thái'>
                            {employeecontracts.find((emct) => emct.EmployeeID === selectedEmployee.EmployeeID)?.Status}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* Tạo tài khoản người dùng */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Tạo Tài Khoản Người Dùng</div>} open={isCreateModalOpen} onOk={handleCreateAccountSave} onCancel={handleCreateAccountCancel} centered>
                <Form form={createForm} layout='vertical'>
                    <Form.Item label='Tên tài khoản' name='UserName' rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}>
                        <Input placeholder='Nhập Username' />
                    </Form.Item>
                    <Form.Item label='Mật khẩu' name='Password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password placeholder='Nhập Password' />
                    </Form.Item>
                    <Form.Item label='Phân quyền' name='Role' rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}>
                        <Select placeholder='Chọn phân quyền'>
                            <Select.Option value='admin'>Admin</Select.Option>
                            <Select.Option value='director'>Giám đốc</Select.Option>
                            <Select.Option value='manager'>Quản lý</Select.Option>
                            <Select.Option value='accountant'>Kế toán</Select.Option>
                            <Select.Option value='employee'>Nhân viên</Select.Option>
                            <Select.Option value='hr'>HR</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Thông Tin Nhân Sự</div>} open={isEditModalOpen} onOk={() => handleEditSave(editForm, selectedImage)} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='Mã nhân viên' name='EmployeeID'>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label='Họ và tên' name='FullName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ảnh đại diện'>
                        <div>
                            {previewImage ? (
                                <img src={previewImage} alt='Ảnh nhân viên' width='40' />
                            ) : (
                                <p>Chưa có ảnh</p>
                            )}
                        </div>
                        <Upload
                            listType='picture'
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setSelectedImage(file);
                                setPreviewImage(URL.createObjectURL(file));
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label='Số điện thoại' name='PhoneNumber' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày sinh' name='DateOfBirth'>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Giới tính' name='Gender'>
                        <Select>
                            <Select.Option value='Nam'>Nam</Select.Option>
                            <Select.Option value='Nữ'>Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Địa chỉ' name='Address'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Email cá nhân' name='PersonalEmail' rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Email công việc' name='WorkEmail' rules={[{ required: true }, { type: 'email' }]}>
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item label='Phòng ban' name='DepartmentID' rules={[{ required: true }]}>
                        <Select>
                            {departments.map(dept => (
                                <Select.Option key={dept.DepartmentID} value={dept.DepartmentID}>{dept.DepartmentName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Chức danh' name='JobTitle' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Chức vụ' name='Position' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày bắt đầu' name='StartDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Nhân Sự</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered >
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Mã nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Họ và tên' name='FullName' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ảnh đại diện'>
                        <div>
                            {previewImage ? (
                                <img src={previewImage} alt='Ảnh nhân viên' width='40' />
                            ) : (
                                <p>Chưa có ảnh</p>
                            )}
                        </div>
                        <Upload
                            listType='picture'
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setSelectedImage(file);
                                setPreviewImage(URL.createObjectURL(file));
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label='Số điện thoại' name='PhoneNumber' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày sinh' name='DateOfBirth'>
                        <Input type='date' />
                    </Form.Item>
                    <Form.Item label='Giới tính' name='Gender'>
                        <Select>
                            <Select.Option value='Nam'>Nam</Select.Option>
                            <Select.Option value='Nữ'>Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Địa chỉ' name='Address'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Email cá nhân' name='PersonalEmail' rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Email công việc' name='WorkEmail' rules={[{ required: true }, { type: 'email' }]}>
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item label='Phòng ban' name='DepartmentID' rules={[{ required: true }]}>
                        <Select>
                            {departments.map(dept => (
                                <Select.Option key={dept.DepartmentID} value={dept.DepartmentID}>{dept.DepartmentName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Chức danh' name='JobTitle' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Chức vụ' name='Position' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày bắt đầu' name='StartDate' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default General;