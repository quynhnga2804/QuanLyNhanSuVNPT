import { Table, Button, Descriptions, Upload, Flex, Select, Space, Typography, Modal, Form, Input, message, Image } from 'antd';
import React, { useState } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';

const General = ({ employees, departments, users, fetchEmployees, fetchUsers, employeecontracts }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();

    const uniqueGenders = [...new Set(employees.map(emp => emp.Gender).filter(Boolean))];
    const uniquePositions = [...new Set(employees.map(emp => emp.Position).filter(Boolean))];
    const uniqueDepartmentIDs = [...new Set(employees.map(emp => emp.DepartmentID).filter(Boolean))];

    const userAccount = users.find(user => user.WorkEmail === selectedEmployee?.WorkEmail);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ UserName: "", Password: "", Role: "employee" });

    const handleCreateAccount = () => {
        setIsCreateModalOpen(true);
    };

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
            const token = localStorage.getItem('token');

            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });

            if (selectedImage) {
                formData.append('Image', selectedImage);
            }

            await axios.put(`http://localhost:5000/api/admin/employees/${values.EmployeeID}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            fetchEmployees();
            message.success('Chỉnh sửa thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const handleAddNew = () => {
        setIsAddModalOpen(true);
    };

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        setPreviewImage(null);
        addForm.resetFields();
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            const token = localStorage.getItem('token');

            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });

            if (selectedImage) {
                formData.append('Image', selectedImage);
            }

            await axios.post('http://localhost:5000/api/admin/employees', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchEmployees();
            message.success('Thêm mới nhân sự thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.FullName.toLowerCase().includes(searchQuery) ||
        emp.EmployeeID.toLowerCase().includes(searchQuery) ||
        emp.Address.toLowerCase().includes(searchQuery) ||
        emp.PhoneNumber.includes(searchQuery)
    );

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa nhân sự ${record.FullName} (Mã: ${record.EmployeeID}) không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/employees/${record.EmployeeID}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(`Xóa nhân sự ${record.FullName} thành công!`);
                    fetchEmployees();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const createUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:5000/api/admin/users/create",
                {
                    WorkEmail: selectedEmployee.WorkEmail,
                    UserName: newUser.UserName,
                    Password: newUser.Password, // Mã hóa trên backend
                    Role: newUser.Role,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                message.success("Tạo tài khoản thành công!");
                fetchUsers();
            } else {
                message.error("Lỗi khi tạo tài khoản!");
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi kết nối server!");
        }
    };

    const handleViewAccount = (user) => {
        Modal.info({
            title: "Thông Tin Tài Khoản",
            content: (
                <div>
                    <p><b>WorkEmail:</b> {user.WorkEmail}</p>
                    <p><b>Username:</b> {user.UserName}</p>
                    <p><b>Role:</b> {user.Role}</p>
                </div>
            ),
        });
    };

    const handleDeleteAccount = async (email) => {
        Modal.confirm({
            title: "Xác nhận xóa tài khoản",
            content: `Bạn có chắc chắn muốn xóa tài khoản của nhân viên này không?\nHành động này không thể hoàn tác!`,
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`http://localhost:5000/api/admin/users/delete/${email}`, {
                        headers: { "Authorization": `Bearer ${token}` },
                    });

                    if (response.status === 200) {
                        message.success("Xóa tài khoản thành công!");
                        fetchUsers();
                    } else {
                        message.error("Lỗi khi xóa tài khoản!");
                    }
                } catch (error) {
                    console.error(error);
                    message.error("Lỗi kết nối server!");
                }
            },
            onCancel: () => {
                message.info("Hủy xóa tài khoản!");
            },
        });
    };

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
                return <Image src={imageSrc} alt="Ảnh" style={{
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
            align: 'left',
            filters: uniqueGenders.map(gd => ({ text: gd, value: gd })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.Gender === value,
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
            filterSearch: true,
            onFilter: (value, record) => record.Position === value,
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
            filterSearch: true,
            onFilter: (value, record) => record.DepartmentID === value,
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 106,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)} style={{ border: 'none', height: '20px', width: '40px' }}><EditOutlined /></Button>
                    <Button type="link" danger onClick={() => handleDelete(record)} style={{ border: 'none', height: '20px', width: '40px' }}><DeleteOutlined /></Button>
                </>
            ),
        }
    ];

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

                    <Button type='primary' onClick={handleAddNew}>
                        <Space>
                            Tạo mới <UserAddOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                rowKey='EmployeeID'
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
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
            />


            {/* Chi tiết nhân sự */}
            <Modal title={<div style={{ textAlign: 'center', width: '100%' }}>Chi Tiết Nhân Sự</div>} open={isShowModalOpen} onCancel={closeModal} footer={null} width={750} centered>
                {selectedEmployee && (
                    <Descriptions column={2} size="small">
                        {/* Hình ảnh */}
                        <Descriptions.Item>
                            <Image
                                src={selectedEmployee.Image ? `http://localhost:5000/uploads/${selectedEmployee.Image}` : "/default-avatar.png"}
                                alt="Ảnh"
                                width={170}
                                height={170}
                                style={{
                                    borderRadius: "50%",
                                    border: "1px solid lightgray",
                                    objectFit: "cover",
                                    display: "block",
                                    marginBottom: "10px",
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item>
                            {userAccount ? (
                                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
                                    <Button type="primary" onClick={() => handleViewAccount(userAccount)}>Xem Tài Khoản</Button>
                                    <Button type="danger" onClick={() => handleDeleteAccount(userAccount.WorkEmail)}>Xóa Tài Khoản</Button>
                                </div>
                            ) : (
                                <Button type="primary" style={{ display: "block", margin: "10px auto" }} onClick={handleCreateAccount}>
                                    Tạo Tài Khoản
                                </Button>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Mã Nhân Viên">
                            {selectedEmployee.EmployeeID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức Danh">
                            {selectedEmployee.JobTitle}
                        </Descriptions.Item>

                        <Descriptions.Item label="Họ và Tên">
                            {selectedEmployee.FullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức vụ">
                            {selectedEmployee.Position}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày Sinh">
                            {selectedEmployee.DateOfBirth ? dayjs(selectedEmployee.DateOfBirth).format("DD-MM-YYYY") : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Bắt Đầu">
                            {selectedEmployee.StartDate ? dayjs(selectedEmployee.StartDate).format("DD-MM-YYYY") : ""}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số Điện Thoại">
                            {selectedEmployee.PhoneNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email Cá Nhân">
                            {selectedEmployee.PersonalEmail}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phòng Ban">
                            {departments.find((dept) => dept.DepartmentID === selectedEmployee.DepartmentID)?.DepartmentName || "Không xác định"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email Công Việc">
                            {selectedEmployee.WorkEmail}
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng Thái">
                            {employeecontracts.find((emct) => emct.EmployeeID === selectedEmployee.EmployeeID)?.Status}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* Tạo tài khoản người dùng */}
            <Modal title={<div style={{ textAlign: 'center', width: '100%' }}>Tạo Tài Khoản Người Dùng</div>} open={isCreateModalOpen} onCancel={() => setIsCreateModalOpen(false)} onOk={async () => { await createUser(); setIsCreateModalOpen(false); }} centered>
                <Input
                    placeholder="Nhập Username"
                    value={newUser.UserName}
                    onChange={(e) => setNewUser({ ...newUser, UserName: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
                <Input.Password
                    placeholder="Nhập Password"
                    value={newUser.Password}
                    onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
                <Select
                    value={newUser.Role}
                    onChange={(value) => setNewUser({ ...newUser, Role: value })}
                    style={{ width: "100%" }}
                >
                    <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="Employee">Employee</Select.Option>
                    <Select.Option value="Manager">Manager</Select.Option>
                    <Select.Option value="Director">Director</Select.Option>
                </Select>
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
                                <img src={previewImage} alt="Ảnh nhân viên" width="40" />
                            ) : (
                                <p>Chưa có ảnh</p>
                            )}
                        </div>
                        <Upload
                            listType="picture"
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
                    <Form.Item label='Số điện thoại' name='PhoneNumber'>
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
                    <Form.Item label='Chức danh' name='JobTitle'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Chức vụ' name='Position'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày bắt đầu' name='StartDate'>
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
                                <img src={previewImage} alt="Ảnh nhân viên" width="40" />
                            ) : (
                                <p>Chưa có ảnh</p>
                            )}
                        </div>
                        <Upload
                            listType="picture"
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
                    <Form.Item label='Số điện thoại' name='PhoneNumber'>
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
                    <Form.Item label='Chức danh' name='JobTitle'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Chức vụ' name='Position'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ngày bắt đầu' name='StartDate'>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default General;