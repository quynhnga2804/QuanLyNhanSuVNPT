import { Button, message, Descriptions, Form, Modal, Select, Input, Dropdown, Flex, Space, Table, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import SideContent from './SideContent';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import axios from 'axios';

const LaborContract = ({ employees, fetchEmployeeContracts, employeecontracts, laborcontracts, jobprofiles, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const today = new Date();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEmployContract, setEditingEmployContract] = useState(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const [startDate, setStartDate] = useState(null);
    const [endDateDisabled, setEndDateDisabled] = useState(true);
    const [selectedEmployeeContract, setSelectedEmployeeContract] = useState(null);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const role = JSON.parse(localStorage.getItem('user')).role;
    const workEmail = JSON.parse(localStorage.getItem('user')).email;
    const [newEmployeeContracts, setNewEmployeeContracts] = useState([]);
    const [tableFilters, setTableFilters] = useState({});

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleContractInputChange = (value) => {

        const selectedLabContract = laborcontracts.find(lab => lab.ID_Contract === value);
        if (selectedLabContract) {
            const contractType = selectedLabContract.ContractType;

            if (contractType.includes("năm") || contractType.includes("tháng")) {
                const months = contractType.includes("năm") ? parseInt(contractType.match(/\d+/)?.[0] || 0, 10) * 12 : parseInt(contractType.match(/\d+/)?.[0] || 0, 10);

                if (months > 0 && startDate) {
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + months);
                    addForm.setFieldsValue({ EndDate: endDate.toISOString().split("T")[0] });
                    setEndDateDisabled(true);
                }
            } else if (contractType.includes(" thời hạn")) {
                addForm.setFieldsValue({ EndDate: null });
                setEndDateDisabled(true);
            } else {
                addForm.setFieldsValue({ EndDate: null });
                setEndDateDisabled(false);
            }
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

            // Kiểm tra xem nhân viên có hợp đồng còn hiệu lực không
            const hasActiveContract = employeecontracts.some(contract =>
                contract.EmployeeID === values.EmployeeID &&
                (new Date(contract.EndDate) >= today || contract.EndDate === null)
            );

            if (hasActiveContract) {
                message.error(`Nhân viên ${values.EmployeeID} đã có hợp đồng còn hiệu lực!`);
                return;
            }

            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/employeecontracts', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            fetchEmployeeContracts();
            message.success(`Thêm mới ${values.EmployeeID} thành công!`);
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleEdit = (record) => {
        setEditingEmployContract(record);
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

            const requestData = {
                EmployeeID: editingEmployContract.EmployeeID,
                ID_Contract: editingEmployContract.ID_Contract,
                ...values,
            };

            await axios.put(`http://localhost:5000/api/admin/employeecontracts/${editingEmployContract.employcontractID}`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchEmployeeContracts();
            message.success('Chỉnh sửa thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa hợp đồng ${record.EmployeeID} không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/employeecontracts/${editingEmployContract.employcontractID}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(`Xóa hợp đồng của ${record.EmployeeID} thành công!`);
                    fetchEmployeeContracts();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handleDetails = (record) => {
        setSelectedEmployeeContract(record);
        setIsShowModalOpen(true);
    };

    const closeModal = () => {
        setIsShowModalOpen(false);
        setSelectedEmployeeContract(null);
    };

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    useEffect(() => {
        if (role === 'Manager') {
            const dpID = employees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;
            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const newEmployees = employees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            const relatedEmployeeIDs = newEmployees.map(dv => dv.EmployeeID);
            const filtered = employeecontracts.filter(emp => relatedEmployeeIDs.includes(emp.EmployeeID));
            setNewEmployeeContracts(filtered);
        }
    }, [role, employees, departments, workEmail]);

    const dataSource = role === 'Manager' && newEmployeeContracts.length > 0 ? newEmployeeContracts : employeecontracts;

    const mergedContracts = dataSource.map(emp => {
        const contract = laborcontracts.find(lc => lc.ID_Contract === emp.ID_Contract);
        return {
            ...emp,
            ContractType: contract ? contract?.ContractType : '',
        };
    });

    const expiringContracts = dataSource.filter(emp => {
        if (!emp.EndDate) return false;
        const endDate = new Date(emp.EndDate);
        const daysLeft = (endDate - today) / (1000 * 60 * 60 * 24);
        return daysLeft <= 30 && daysLeft > 0;
    });
    const nowContracts = dataSource.filter(emp => !emp.EndDate || new Date(emp.EndDate) >= today);

    const filteredEmployeeContracts = mergedContracts.filter(emp => {
        const matchesSearchQuery = searchQuery === '' ||
            emp.ContractType.toLowerCase().includes(searchQuery) ||
            employees.find(e => e.EmployeeID === emp.EmployeeID)?.FullName.toLowerCase().includes(searchQuery);

        const selectedStatus = tableFilters.Status || [];
        const matchesStatusFilter = selectedStatus.length === 0 || selectedStatus.includes(emp.Status);

        return matchesSearchQuery && matchesStatusFilter;
    });

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
            title: 'TÊN HỢP ĐỒNG',
            dataIndex: 'ID_Contract',
            minWidth: 119,
            align: 'left',
            render: (id) => {
                const laborcontract = laborcontracts.filter(emp => emp.ID_Contract === id);
                return laborcontract ? laborcontract[0]?.ContractType : '';
            },
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            align: 'center',
            minWidth: 132,
            sorter: (a, b) => new Date(a.StartDate) - new Date(b.StartDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'NGÀY KẾT THÚC',
            dataIndex: 'EndDate',
            minWidth: 140,
            align: 'center',
            sorter: (a, b) => new Date(a.EndDate) - new Date(b.EndDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'EndDate',
            width: 115,
            align: 'center',
            render: (text) => {
                const endDate = text ? new Date(text) : null;

                const status = !endDate || endDate >= today ? 'Hoạt động' : 'Hết hạn';
                const color = status === 'Hết hạn' ? 'red' : 'green';

                return <span style={{ color }}>{status}</span>;
            },
            filters: [
                { text: 'Hoạt động', value: 'Hoạt động' },
                { text: 'Hết hạn', value: 'Hết hạn' }
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => {
                const today = new Date();
                const endDate = record.EndDate ? new Date(record.EndDate) : null;
                const status = !endDate || endDate >= today ? 'Hoạt động' : 'Hết hạn';
                return status === value;
            },
        },
        {
            title: 'CHÍNH THỨC',
            dataIndex: 'EmployeeID',
            width: 98,
            align: 'center',
            render: (id) => {
                const jobProfile = jobprofiles.find(jp => jp.EmployeeID === id);
                const status = jobProfile?.EmploymentStatus || '';
                return (
                    <input
                        type='checkbox'
                        readOnly
                        checked={status.includes('Chính thức')}
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: 'green',
                            border: '2px solid green',
                        }}
                    />
                );
            },
        },
        {
            title: 'THỬ VIỆC',
            dataIndex: 'EmployeeID',
            width: 79,
            align: 'center',
            render: (id) => {
                const jobProfile = jobprofiles.find(jp => jp.EmployeeID === id);
                const status = jobProfile?.EmploymentStatus || '';
                return (
                    <input
                        type='checkbox'
                        readOnly
                        checked={status.includes('Thử việc')}
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: 'green',
                            border: '2px solid green',
                        }}
                    />
                );
            },
        },
        {
            dataIndex: 'edits',
            width: 50,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                const endDate = record.EndDate ? new Date(record.EndDate) : null;
                const isExpired = endDate && endDate < today;

                const menuProps = {
                    items: [
                        {
                            key: 'edit',
                            label: isExpired ? <span style={{ color: 'gray' }}>Chỉnh sửa</span> : 'Chỉnh sửa',
                            onClick: () => {
                                if (!isExpired) handleEdit(record);
                            },
                            disabled: isExpired,
                        },
                        {
                            key: 'details', label: 'Chi tiết', onClick: () => handleDetails(record),
                        },
                        {
                            key: 'delete', label: 'Xóa', onClick: () => handleDelete(record),
                        },
                    ],
                };

                return (
                    <Dropdown menu={menuProps}>
                        <Button>
                            <Space>
                                Sửa <CaretDownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                );
            },
        }
    ];

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px' }}>

                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder='Tìm kiếm...'
                            allowClear
                        />
                    </Space>

                    <Button type='primary' onClick={handleAddNew}>
                        <Space>
                            Tạo mới <PlusCircleOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>

            <div style={{ display: 'flex' }}>
                <Flex vertical style={{ width: '70%' }}>
                    <Table
                        className='table_HD'
                        columns={columns}
                        dataSource={filteredEmployeeContracts.map((item) => ({ ...item, key: `${item.ID_Contract}-${item.EmployeeID}` }))}
                        bordered
                        size='middle'
                        scroll={{
                            x: 'max-content',
                            y: 51 * 9,
                        }}
                        pagination={false}
                        onChange={handleTableChange}
                    />
                </Flex>
                <SideContent nowContracts={nowContracts} expiringContracts={expiringContracts} />
            </div>

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Hợp Đồng</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered>
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Tên nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Select>
                            {employees
                                .filter(emp => !nowContracts.some(contract => contract.EmployeeID === emp.EmployeeID))
                                .map(emp => (
                                    <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                        ({emp.EmployeeID}) {emp.FullName}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Ngày bắt đầu" name="StartDate" rules={[{ required: true }]}>
                        <Input type="date" onChange={handleStartDateChange} />
                    </Form.Item>
                    <Form.Item label="Loại hợp đồng" name="ID_Contract" rules={[{ required: true }]}>
                        <Select onChange={handleContractInputChange} disabled={!startDate}>
                            {laborcontracts.map(lab => (
                                <Select.Option key={lab.ID_Contract} value={lab.ID_Contract}>
                                    ({lab.ID_Contract}) {lab.ContractType}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="EndDate" rules={[{ required: !endDateDisabled }]}>
                        <Input type="date" disabled={endDateDisabled} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Hợp Đồng</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered>
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
                    <Form.Item label="Ngày bắt đầu" name="StartDate" rules={[{ required: true }]}>
                        <Input type="date" onChange={handleStartDateChange} />
                    </Form.Item>
                    <Form.Item label="Loại hợp đồng" name="ID_Contract" rules={[{ required: true }]}>
                        <Select onChange={handleContractInputChange} disabled={!startDate}>
                            {laborcontracts.map(lab => (
                                <Select.Option key={lab.ID_Contract} value={lab.ID_Contract}>
                                    ({lab.ID_Contract}) {lab.ContractType}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="EndDate" rules={[{ required: !endDateDisabled }]}>
                        <Input type="date" disabled={endDateDisabled} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chi tiết */}
            <Modal title={<div style={{ textAlign: 'center', width: '100%' }}>Chi Tiết Hợp Đồng</div>} open={isShowModalOpen} onCancel={closeModal} footer={null} width={650} centered>
                {selectedEmployeeContract && (
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="Mã Nhân Viên">
                            {selectedEmployeeContract.EmployeeID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày bắt đầu">
                            {selectedEmployeeContract.StartDate}
                        </Descriptions.Item>

                        <Descriptions.Item label="Họ và Tên">
                            {employees.find(emp => emp.EmployeeID === selectedEmployeeContract.EmployeeID).FullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày kết thúc">
                            {selectedEmployeeContract.EndDate || 'Không thời hạn'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Mã hợp đồng">
                            {selectedEmployeeContract.ID_Contract}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại hợp đồng">
                            {jobprofiles.find(job => job.EmployeeID === selectedEmployeeContract.EmployeeID).EmploymentStatus}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên hợp đồng">
                            {laborcontracts.find(lab => lab.ID_Contract === selectedEmployeeContract.ID_Contract).ContractType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {!selectedEmployeeContract.EndDate || new Date(selectedEmployeeContract.EndDate) >= today
                                ? <span style={{ color: 'green' }}>Hoạt động</span>
                                : <span style={{ color: 'red' }}>Hết hạn</span>}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </>
    )
}

export default LaborContract