import { Table, Button, Flex, Select, Space, Typography, Modal, Form, Input, message, Row, Col, TimePicker, DatePicker, Descriptions } from 'antd';
import Search from 'antd/es/transfer/search';
import { FieldTimeOutlined } from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { debounce, filter } from 'lodash';
import dayjs from 'dayjs';
import React, { useState, useEffect } from "react";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { TextArea } = Input;
const { Option } = Select;

const OvertimeUser = ({employeeinfo}) => {
    const [overtimeUser, setOvertimeUser] = useState([]);
    const [latestPayrollCycle, setLatestPayrollCycle] = useState(null);
    const [managerList, setManagerList] = useState([]);
    const [mappedOvertimeData, setMappedOvertimeData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [selectedOT, setSelectedOT] = useState(null);
    const [dateRange, setDateRange] = useState([]);
    const [addForm] = Form.useForm();

    const [selectedOTType, setSelectedOTType] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const token = localStorage.getItem('token');

    const uniqueOTType = [...new Set(mappedOvertimeData.map(ov => ov.OTType))];
    const uniqueStatus = [...new Set(mappedOvertimeData.map(ov => ov.Status))];

    const handleAddNew = () => {
        fetchLatestPayrollCycle(); // gọi lại trước khi kiểm tra

        if (!latestPayrollCycle || !latestPayrollCycle.PayrollName) {
            message.warning("Chưa mở kỳ lương mới. Vui lòng liên hệ quản lý để mở kỳ lương!");
            return;
        }
        addForm.setFieldsValue({
            employeeId: employeeinfo?.EmployeeID,
            fullname: employeeinfo?.FullName,
            payroll: latestPayrollCycle.PayrollName,
            payrollID: latestPayrollCycle.ID_PayrollCycle,
            company: 'VNPT Nghệ An',
            status: 'Chờ duyệt',
        });
        setIsAddModalOpen(true);
    };

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const showModal = (record) => {
        setSelectedOT(record);
        setIsShowModalOpen(true);
    };

    const closeModal = () => {
        setIsShowModalOpen(false);
        setSelectedOT(null);
    };

    useEffect(() => {
        if (token) {
            fetchOvertimeUser();
            fetchLatestPayrollCycle();
            fetchManagerList();
        }

    }, [token]);

    const fetchOvertimeUser = async () => {
        try {
            const response = await axiosClient.get('/user/overtimes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOvertimeUser(response.data);
        } catch (error) {
            console.error("Không lấy được dữ liệu tăng ca!", error);
        }
    };

    const fetchLatestPayrollCycle = async () => {
        try {
            const response = await axiosClient.get(`/user/latest-payrollcycle`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLatestPayrollCycle(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy kỳ lương gần nhất:', error);
        }
    };

    const fetchManagerList = async () => {
        try {
            const response = await axiosClient.get(`/user/get-managers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setManagerList(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách manager:', error);
        }
    };

    // Đây là useEffect để map tên Manager từ managerList vào overtimeUser
    useEffect(() => {
        if (overtimeUser.length > 0 && managerList.length > 0) {
            const mappedData = overtimeUser.map((item) => {
                const manager = managerList.find((m) => m.EmployeeID === item.ManagerID);
                return {
                    ...item,
                    ManagerName: manager ? manager.FullName : 'Chưa có',
                };
            });
            setMappedOvertimeData(mappedData);
        }
    }, [overtimeUser, managerList]);

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            if (!values.reason || !values.reason.trim()) {
                message.error("Vui lòng điền lý do tăng ca!");
                return;
            }
            const today = new Date();
            if (today >= values.otDate.toDate()) {
                message.error("Ngày OT không hợp lệ!");
                return;
            }
            const newOT = {
                EmployeeID: values.employeeId,   
                ManagerID: values.managerId,
                ReasonOT: values.reason,
                OTType: values.otType,
                DateTime: values.otDate.format('YYYY-MM-DD'),
                OverTimesHours: parseFloat(values.otHours),
                Status: values.status,
                ID_PayrollCycle: values.payrollID,
                CreatedAt: new Date(),
                
            };
            await axiosClient.post('/user/req-overtime', newOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            fetchOvertimeUser();
            message.success('Tạo đề xuất tăng ca thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi thêm tăng ca, vui lòng kiểm tra lại!');
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
            title: 'KỲ LƯƠNG',
            dataIndex: 'PayrollCycle',
            width: 150,
            align: 'center',
            ellipsis: true,
            render: (payroll) => payroll?.PayrollName || '',
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
            title: 'LOẠI NGÀY TĂNG CA',
            dataIndex: 'OTType',
            width: 150,
            align: 'center',
            ellipsis: true,
            filters: uniqueOTType.map(ott => ({ text: ott, value: ott })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedOTType.length === value || selectedOTType.includes(record.OTType),
        },
        {
            title: 'NGÀY TĂNG CA',
            dataIndex: 'DateTime',
            width: 130,
            align: 'center',
            sorter: (a, b) => new Date(a.DateTime) - new Date(b.DateTime),
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'SỐ GIỜ TĂNG CA',
            dataIndex: 'OverTimesHours',
            width: 130,
            align: 'center',
            sorter: (a, b) => a.OverTimesHours - b.OverTimesHours,
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
            // render: (status) => mapStatus(status),
            render: (status) => {
                const { text, color } = mapStatus(status);
                return <span style={{color: color}}>{text}</span>;
            }
        },
    ];

    const handleSearch = debounce((value) => setSearchQuery(value.toLowerCase()), 500);

    const filteredOvertimes = mappedOvertimeData.filter(ov => {
        const matchesSearch =
            ov.Status?.toLowerCase().includes(searchQuery) ||
            ov.OTType?.toLowerCase().includes(searchQuery) ||
            ov.ManagerName?.toLowerCase().includes(searchQuery);
    
        const matchesDateRange = dateRange.length === 2
            ? dayjs(ov.DateTime).isSameOrAfter(dateRange[0].startOf('day')) &&
              dayjs(ov.DateTime).isSameOrBefore(dateRange[1].endOf('day'))
            : true;
        const matchesFilters = (
            // (!selectedPayroll.length || selectedPayroll.includes(ov.ID_PayrollCycle)) && 
            // (!selectedManager.length || selectedManager.includes(ov.ManagerName)) && 
            (!selectedOTType.length || selectedOTType.includes(ov.OTType)) && 
            (!selectedStatus.length || selectedStatus.includes(ov.Status))
        );
        return matchesSearch && matchesDateRange && matchesFilters;
    });
    
    const handleTableChange = (pagination, filters, sorter) => {
        // setSelectedPayroll(filters.ID_PayrollCycle || []);
        // setSelectedManager(filters.ManagerName || []);
        setSelectedOTType(filters.OTType || []);
        setSelectedStatus(filters.Status || []);
    };

    return (
        <Flex vertical style={{ width: '100%' }}>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#f0f0f1' }}>
                <Typography.Text type='secondary' style={{ color: '#2b2b2b', fontSize: '1rem' }}>
                    Số lượng: {filteredOvertimes.length}
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
                            Tạo mới <FieldTimeOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredOvertimes.map(ov => ({ ...ov, key: ov.ID_OT }))}
                onChange={handleTableChange}
                onRow={(record) => ({ onDoubleClick: () => showModal(record), })}
                bordered
                size='medium'
                scroll={{ x: 1200, y: 52.8 * 9 }}
                pagination={false}
            />

            <Modal
                className='editfrm'
                title={<div style={{ textAlign: 'center', width: '100%', margin: '1rem 0 2rem 0' }}>Thêm Mới Tăng Ca</div>}
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
                            <Form.Item label='Công ty' name='company' initialValue={'VNPT Nghệ An'} rules={[{ required: true }]} >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label='Kỳ lương' name='payroll' rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label='Lý do OT' name='reason' rules={[{ required: true }]}>
                                <TextArea rows={3} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Loại ngày OT' name='otType' rules={[{ required: true }]}>
                                <Select placeholder="Chọn loại ngày OT">
                                    <Option value="Ngày thường">Ngày thường</Option>
                                    <Option value="Cuối tuần">Cuối tuần</Option>
                                    <Option value="Ngày lễ">Ngày lễ</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label='Số giờ OT' name='otHours' rules={[ { required: true, message: 'Vui lòng nhập số giờ OT!' } ]}>
                                <Input type="number" step="0.01" min="0" />
                            </Form.Item>
                            <Form.Item label='Ngày OT' name='otDate' rules={[{ required: true }]}>
                                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label='Trạng thái' name='status' initialValue={'Chờ duyệt'} rules={[{ required: true }]} >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name="payrollID" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="createdAt" hidden>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Xem chi tiết tăng ca */}
            <Modal className='descriptions' title={<div style={{ textAlign: 'center', width: '100%', margin:'1rem 0 2rem 0' }}>Chi Tiết Tăng Ca</div>} open={isShowModalOpen} onCancel={closeModal} footer={null} width={800} centered>
                {selectedOT && (
                    
                    <Descriptions column={2} size="middle" labelStyle={{width:'120px'}}>
                        <Descriptions.Item label="Mã OT" labelCol={'120px'}>
                            {selectedOT.ID_OT}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày OT">
                            {selectedOT.DateTime ? dayjs(selectedOT.DateTime).format("DD-MM-YYYY") : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Nhân Viên">
                            {selectedOT.Employee?.FullName || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quản lý">
                            {selectedOT.ManagerName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Lý Do OT">
                            {selectedOT.ReasonOT}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng Số Giờ OT">
                            {selectedOT.OverTimesHours}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại Ngày OT">
                            {selectedOT.OTType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng Thái">
                            <span style={{color: mapStatus(selectedOT.Status)?.color}}>
                            {mapStatus(selectedOT.Status)?.text}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Kỳ Lương">
                            {selectedOT.PayrollCycle?.PayrollName || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="CreatedAt">
                            {selectedOT.CreatedAt}
                        </Descriptions.Item>
                        <Descriptions.Item label="ApprovedAt">
                        </Descriptions.Item>
                            {selectedOT.ApprovedAt}
                        </Descriptions>
                        
                )}
            </Modal>
        </Flex>
    );
};

export default OvertimeUser;
