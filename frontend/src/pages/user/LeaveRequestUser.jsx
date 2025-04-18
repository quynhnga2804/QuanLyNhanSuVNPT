import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message, Row, Col, DatePicker, Descriptions } from 'antd';
import Search from 'antd/es/transfer/search';
import { CalendarOutlined } from '@ant-design/icons';
import axios from "axios";
import { debounce, filter } from 'lodash';
import dayjs from 'dayjs';
import React, { useState, useEffect } from "react";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { TextArea } = Input;
const { Option } = Select;

const LeaveRequestUser = ({ employeeinfo}) => {
    const [leaveUser, setLeaveUser] = useState([]);
    const [managerList, setManagerList] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [selectedLeaveRe, setSelectedLeaveRe] = useState(null);
    const [dateRange, setDateRange] = useState([]);
    const [addForm] = Form.useForm();

    const [selectedStatus, setSelectedStatus] = useState([]);
    const token = localStorage.getItem('token');
    const uniqueStatus = [...new Set(mappedData.map(lr => lr.Status))];

    const handleAddNew = () => {
        addForm.setFieldsValue({
            employeeId: employeeinfo?.EmployeeID,
            fullname: employeeinfo?.FullName,
            status: 'Chờ duyệt',
        });
        setIsAddModalOpen(true);
    };

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const showModal = (record) => {
        setSelectedLeaveRe(record);
        setIsShowModalOpen(true);
    };

    const closeModal = () => {
        setIsShowModalOpen(false);
        setSelectedLeaveRe(null);
    };

    useEffect(() => {
        if (token) {
            fetchLeaveInfo();
            fetchManagerList();
        }
    }, [token]);

    const fetchLeaveInfo = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/leaves', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLeaveUser(response.data);
        } catch (error) {
            console.error("Lỗi từ backend:", error.response.data);
            console.error("Không lấy được dữ liệu nghỉ phép!", error);
        }
    };

    const fetchManagerList = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/get-managers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setManagerList(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách manager:', error);
        }
    };

    useEffect(() => {
        if (leaveUser.length > 0 && managerList.length > 0) {
            const mappedData = leaveUser.map((item) => {
                const manager = managerList.find((m) => m.EmployeeID === item.ManagerID);
                return {
                    ...item,
                    ManagerName: manager ? manager.FullName : 'Chưa có',
                };
            });
            setMappedData(mappedData);
        }
    }, [leaveUser, managerList]);

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            const newLeaveRe = {
                EmployeeID: values.employeeId,   
                ManagerID: values.managerId,
                LeaveReason: values.reason,
                StartDate: values.startDate.toDate(),
                EndDate: values.endDate.toDate(),
                Status: 'Pending',
                
            };
            await axios.post('http://localhost:5000/api/user/leave-req', newLeaveRe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            fetchLeaveInfo();
            message.success('Tạo yêu cầu nghỉ phép thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi thêm nghỉ phép, vui lòng kiểm tra lại!');
        }
    };

    const mapStatus = (status) => {
        switch (status) {
            case 'Approved':
                return { text: 'Đã duyệt', color: 'green' };
            case 'Rejected':
                return { text: 'Đã hủy', color: 'red' };
            case 'Pending':
                return { text: 'Chờ duyệt', color: 'orange' };
            default:
                return { text: status, color: 'black' };
        }
    };

    const columns = [
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'Employee',
            width: 150,
            fixed: 'left',
            align: 'center',
            ellipsis: true,
            render: (employee) => employee?.FullName || '',
        },
        {
            title: 'NGƯỜI QUẢN LÝ',
            dataIndex: 'ManagerName',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (managerName) => managerName || 'Chưa có',
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            width: 130,
            align: 'center',
            sorter: (a, b) => new Date(a.StartDate) - new Date(b.StartDate),
            render: (date) => dayjs(date).format('DD/MM/YYYY, HH:mm:ss'),
        },
        {
            title: 'NGÀY KẾT THÚC',
            dataIndex: 'EndDate',
            width: 130,
            align: 'center',
            sorter: (a, b) => new Date(a.EndDate) - new Date(b.EndDate),
            render: (date) => dayjs(date).format('DD/MM/YYYY, HH:mm:ss'),
        },
        {
            title: 'LÝ DO XIN NGHỈ',
            dataIndex: 'LeaveReason',
            width: 130,
            align: 'center',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            width: 120,
            align: 'center',
            ellipsis: true,
            filters: uniqueStatus.map(stt => ({ text: mapStatus(stt).text, value: stt })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedStatus.length === value || selectedStatus.includes(record.Status),
            render: (status) => {
                const { text, color } = mapStatus(status);
                return <span style={{color: color}}>{text}</span>;
            }
        },
    ];

    const handleSearch = debounce((value) => setSearchQuery(value.toLowerCase()), 500);

    const filteredLeaveRe = mappedData.filter(lr => {
        const matchesSearch =
            lr.Status?.toLowerCase().includes(searchQuery) ||
            lr.ManagerName?.toLowerCase().includes(searchQuery) || 
            lr.LeaveReason?.toLowerCase().includes(searchQuery);
    
        const matchesDateRange = dateRange.length === 2
            ? ((dayjs(lr.StartDate).isSameOrAfter(dateRange[0].startOf('day')) && dayjs(lr.StartDate).isSameOrBefore(dateRange[1].endOf('day'))) || 
              (dayjs(lr.EndDate).isSameOrAfter(dateRange[0].startOf('day')) && dayjs(lr.EndDate).isSameOrBefore(dateRange[1].endOf('day'))))
            : true;

        // const matchesDateRange = (dateRange && dateRange.length === 2) ? (
        //             (emp.StartDate && dayjs(emp.StartDate).isSameOrAfter(dateRange[0].startOf('day')) &&
        //                 dayjs(emp.StartDate).isSameOrBefore(dateRange[1].endOf('day'))) ||
        //             (emp.ResignationsDate && dayjs(emp.ResignationsDate).isSameOrAfter(dateRange[0].startOf('day')) &&
        //                 dayjs(emp.ResignationsDate).isSameOrBefore(dateRange[1].endOf('day')))
        //         ) : true;
        const matchesFilters = (
            (!selectedStatus.length || selectedStatus.includes(lr.Status))
        );
        return matchesSearch && matchesDateRange && matchesFilters;
    });
    
    const handleTableChange = (pagination, filters, sorter) => {
        setSelectedStatus(filters.Status || []);
    };

    return (
        <Flex vertical style={{ width: '100%' }}>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#f0f0f1' }}>
                <Typography.Text type='secondary' style={{ color: '#2b2b2b', fontSize: '1rem' }}>
                    Số lượng: {filteredLeaveRe.length}
                </Typography.Text>
                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <DatePicker.RangePicker
                            format="DD/MM/YYYY"
                            onChange={(dates) => {
                                if (dates) {
                                  setDateRange(dates);
                                } else {
                                  setDateRange([]);
                                }
                              }}
                            allowClear
                        />
                    </Space>
                    <Space>
                        <Search
                            placeholder='Tìm kiếm theo trạng thái, loại ngày OT...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>
                    <Button type='primary' onClick={handleAddNew}>
                        <Space>
                            Tạo mới <CalendarOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredLeaveRe.map(lr => ({ ...lr, key: lr.LeaveRequestID }))}
                onChange={handleTableChange}
                onRow={(record) => ({ onDoubleClick: () => showModal(record), })}
                bordered
                size='medium'
                scroll={{ x: 1200, y: 52.8 * 9 }}
                pagination={false}
            />

            <Modal
                className='editfrm'
                title={<div style={{ textAlign: 'center', width: '100%', margin: '1rem 0 2rem 0' }}>Thêm Mới Nghỉ Phép</div>}
                open={isAddModalOpen}
                onOk={handleAddSave}
                onCancel={handleAddCancel}
                centered
                width={800}
            >
                <Form
                    form={addForm}
                    layout="horizontal"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    labelAlign="left"
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="employeeId" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item label='Họ tên nhân viên' name='fullname' rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label='Manager' name='managerId' rules={[{ required: true, message: 'Vui lòng chọn người quản lý' }]}>
                                <Select placeholder="Chọn người quản lý" onChange={(value) => {
                                    const selectedManager = managerList.find((m) => m.EmployeeID === value);
                                    addForm.setFieldsValue({ managerName: selectedManager?.FullName });
                                }}>
                                    {managerList.map((mng) => (
                                        <Option key={mng.EmployeeID} value={mng.EmployeeID}>
                                            {mng.FullName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label='Lý do nghỉ phép' name='reason' rules={[{ required: true }]}>
                                <TextArea rows={3} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Ngày bắt đầu nghỉ' name='startDate' rules={[{ required: true }]}>
                                <DatePicker showTime format="DD-MM-YYYY, HH:mm:ss" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label='Ngày kết thúc nghỉ' name='endDate' rules={[{ required: true }]}>
                                <DatePicker showTime format="DD-MM-YYYY, HH:mm:ss" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label='Trạng thái' name='status' initialValue={'Chờ duyệt'} rules={[{ required: true }]} >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name="createdAt" hidden>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Xem chi tiết tăng ca */}
            <Modal className='descriptions' title={<div style={{ textAlign: 'center', width: '100%', margin:'1rem 0 2rem 0' }}>Chi Tiết Nghỉ Phép</div>} open={isShowModalOpen} onCancel={closeModal} footer={null} width={800} centered>
                {selectedLeaveRe && (
                    
                    <Descriptions column={2} size="middle" labelStyle={{width:'120px'}}>
                        <Descriptions.Item label="Mã Nghỉ Phép" labelCol={'120px'}>
                            {selectedLeaveRe.LeaveRequestID }
                        </Descriptions.Item>
                        <Descriptions.Item label="StartDate">
                            {selectedLeaveRe.StartDate ? dayjs(selectedLeaveRe.StartDate).format("DD-MM-YYYY, HH:ss:mm") : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Nhân Viên">
                            {selectedLeaveRe.Employee?.FullName || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quản lý">
                            {selectedLeaveRe.ManagerName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Lý Do OT">
                            {selectedLeaveRe.LeaveReason}
                        </Descriptions.Item>
                        <Descriptions.Item label="EndDate">
                            {selectedLeaveRe.EndDate ? dayjs(selectedLeaveRe.EndDate).format("DD-MM-YYYY, HH:ss:mm") : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng Thái">
                            <span style={{color: mapStatus(selectedLeaveRe.Status)?.color}}>
                            {mapStatus(selectedLeaveRe.Status)?.text}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="CreatedAt">
                            {selectedLeaveRe.CreatedAt ? dayjs(selectedLeaveRe.CreatedAt).format("DD-MM-YYYY, HH:ss:mm") : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="ApprovedAt">
                        </Descriptions.Item>
                            {selectedLeaveRe.ApprovedAt ? dayjs(selectedLeaveRe.ApprovedAt).format("DD-MM-YYYY, HH:ss:mm") : ""}
                        </Descriptions>
                        
                )}
            </Modal>
        </Flex>
    );
};

export default LeaveRequestUser;
