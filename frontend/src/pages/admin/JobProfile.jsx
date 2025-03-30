import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import Search from 'antd/es/transfer/search';
import { UserAddOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';

const JobProfile = ({ employees, fetchJobProfiles, jobprofiles, departments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJobProfile, setEditingJobProfile] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const role = JSON.parse(localStorage.getItem('user')).role;
  const workEmail = JSON.parse(localStorage.getItem('user')).email;
  const [newJobProfiles, setNewJobProfiles] = useState([]);
  const [tableFilters, setTableFilters] = useState({});

  const uniqueEmploymentStatuses = [...new Set(jobprofiles.map(emp => emp.EmploymentStatus).filter(Boolean))];

  const handleEdit = (record) => {
    setEditingJobProfile(record);
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
      await axios.put(`http://localhost:5000/api/admin/jobprofiles/${editingJobProfile.EmployeeID}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchJobProfiles();
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
      await axios.post('http://localhost:5000/api/admin/jobprofiles', values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchJobProfiles();
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
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/admin/jobprofiles/${record.EmployeeID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success(`Xóa ${record.EmployeeID} thành công!`);
          fetchJobProfiles();
        } catch (error) {
          message.error('Xóa thất bại, vui lòng thử lại.');
        }
      },
    });
  };

  useEffect(() => {
    if (role === 'Manager') {
      const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
      const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
      const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
      const newEmployees = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
      const relatedEmployeeIDs = newEmployees.map(dv => dv.EmployeeID);
      const filtered = jobprofiles.filter(emp => relatedEmployeeIDs.includes(emp.EmployeeID));
      setNewJobProfiles(filtered);
    }
  }, [role, employees, departments, workEmail]);

  const columns = [
    {
      title: 'MÃ NHÂN VIÊN',
      dataIndex: 'EmployeeID',
      minWidth: 111,
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
      title: 'LOẠI NHÂN VIÊN',
      dataIndex: 'EmploymentStatus',
      align: 'center',
      minWidth: 135,
      filters: uniqueEmploymentStatuses.map(gd => ({ text: gd, value: gd })),
      filterMode: 'tree',
      filterSearch: true,
    },
    {
      title: 'GIỜ LÀM VIỆC TIÊU CHUẨN',
      dataIndex: 'StandardWorkingHours',
      minWidth: 183,
      align: 'center',
    },
    {
      title: 'SỐ PHÉP NĂM',
      dataIndex: 'RemainingLeaveDays',
      align: 'center',
      minWidth: 108,
    },
    {
      title: 'SĐT KHẨN CẤP',
      dataIndex: 'EmergencyContactNumber',
      minWidth: 115,
      align: 'center',
    },
    {
      title: 'TÊN NGƯỜI LH KHẨN CẤP',
      dataIndex: 'EmergencyContactName',
      align: 'left',
      minWidth: 177,
    },
    {
      title: 'LƯƠNG CƠ BẢN',
      dataIndex: 'BaseSalary',
      minWidth: 140,
      align: 'right',
      sorter: (a, b) => a.BaseSalary - b.BaseSalary,
      render: (value) => new Intl.NumberFormat('vi-VN').format(value),
    },
    {
      title: 'PHỤ CẤP',
      dataIndex: 'Allowance',
      minWidth: 100,
      align: 'right',
      sorter: (a, b) => a.BaseSalary - b.BaseSalary,
      render: (value) => new Intl.NumberFormat('vi-VN').format(value),
    },
  ];

  if (role === 'Director' || role === 'Admin') {
    columns.push({
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
    });
  }

  const handleSearch = debounce((value) => {
    setSearchQuery(value.toLowerCase());
  }, 500);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilters(filters);
  };

  const dataSource = role === 'Manager' && newJobProfiles.length > 0 ? newJobProfiles : jobprofiles;
  const filteredJobProfiles = dataSource.filter(dvs => {
    const matchesSearchQuery = searchQuery === '' ||
      dvs.EmployeeID.toLowerCase().includes(searchQuery) ||
      employees.find(e => e.EmployeeID === dvs.EmployeeID)?.FullName.toLowerCase().includes(searchQuery.toLowerCase());

    const selectedEmploymentStatus = tableFilters.EmploymentStatus || [];
    const matchesEmploymentStatusFilter = selectedEmploymentStatus.length === 0 || selectedEmploymentStatus.includes(dvs.EmploymentStatus);

    return matchesSearchQuery && matchesEmploymentStatusFilter;
  });

  return (
    <>
      <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
        <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
          Số lượng: {filteredJobProfiles.length}
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
        dataSource={filteredJobProfiles.map(dvs => ({ ...dvs, key: dvs.EmployeeID }))}
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
      <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Bộ Phận</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
        <Form form={addForm} layout='vertical'>
          <Form.Item label='Tên nhân viên' name='EmployeeID' rules={[{ required: true }]}>
            <Select placeholder="Chọn nhân viên">
              {employees.filter(emp => !jobprofiles.some(profile => profile.EmployeeID === emp.EmployeeID)).map(emp => (
                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                  {emp.FullName} ({emp.EmployeeID})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Loại nhân viên' name='EmploymentStatus' rules={[{ required: true }]}>
            <Select placeholder="Chọn phân loại nhân viên">
              <Select.Option value='Chính thức'>Chính thức</Select.Option>
              <Select.Option value='Thử việc'>Thử việc</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Số giờ làm việc tiêu chuẩn' name='StandardWorkingHours' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Số phép trong năm' name='RemainingLeaveDays' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Số điện thoại liên hệ khẩn cấp' name='EmergencyContactNumber' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Tên người liên hệ khẩn cấp' name='EmergencyContactName' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Lương cơ bản' name='BaseSalary' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Phụ cấp' name='Allowance' rules={[{ required: true }]}>
            <Input type='number' />
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
          <Form.Item label='Loại nhân viên' name='EmploymentStatus' rules={[{ required: true }]}>
            <Select placeholder="Chọn phân loại nhân viên">
              <Select.Option value='Chính thức'>Chính thức</Select.Option>
              <Select.Option value='Thử việc'>Thử việc</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Số giờ làm việc tiêu chuẩn' name='StandardWorkingHours' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Số phép trong năm' name='RemainingLeaveDays' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Số điện thoại liên hệ khẩn cấp' name='EmergencyContactNumber' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Tên người liên hệ khẩn cấp' name='EmergencyContactName' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Lương cơ bản' name='BaseSalary' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Phụ cấp' name='Allowance' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default JobProfile