import React, { useEffect, useState } from 'react';
import { List, Modal, Input, DatePicker, Tag, Form, Badge, Button, Dropdown, Tooltip, Menu, Flex, Select, message, Typography } from 'antd';
import { EllipsisOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const Notifications = ({ fetchUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [usernotifications, setUserNotifications] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const workEmail = currentUser?.email;
    const [filterType, setFilterType] = useState('all');
    const EmployeeID = employees.find(emp => emp.WorkEmail === workEmail)?.EmployeeID;
    const [selectedNotification, setSelectedNotification] = useState(null);

    const filteredStatuses = notifications.filter(item => {
        const isDeleted = usernotifications.some(userNo =>
            userNo.NotificationID === item.NotificationID &&
            userNo.EmployeeID === EmployeeID &&
            userNo.IsDeleted === 1
        );

        if (isDeleted) return false;

        if (filterType === 'sent') return item.sentID === EmployeeID;
        if (filterType === 'received') return item.receivedID === EmployeeID || (item.sentID !== EmployeeID && item.receivedID === 'All');
        if (filterType === 'expired') return item.ExpiredAt && dayjs(item.ExpiredAt).isBefore(dayjs());
        return item.sentID === EmployeeID || item.receivedID === EmployeeID || (item.sentID !== EmployeeID && item.receivedID === 'All');
    });

    useEffect(() => {
        fetchEmployees(token);
        fetchNotifications(token);
        fetchUserNotifications(token);
    }, []);

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
            const formData = new FormData();

            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });
            formData.append('sentID', EmployeeID);

            await axios.post('http://localhost:5000/api/admin/notifications', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            fetchNotifications();
            message.success('Gửi thông báo thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setEmployees(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy thông báo:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNotifications(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy thông báo:', error);
        }
    };

    const fetchUserNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/usernotifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUserNotifications(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy thông báo:', error);
        }
    };

    const handleOpenNotification = async (notification) => {
        setSelectedNotification(notification);

        if (!isNotificationRead(notification.NotificationID)) {
            handleReadNotification(notification.NotificationID);
        }
    };

    const handleDeleteNotification = async (notificationID) => {
        try {
            await axios.post('http://localhost:5000/api/admin/usernotifications', {
                EmployeeID: EmployeeID,
                NotificationID: notificationID,
                IsDeleted: 1
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNotifications(prev => prev.filter(item => item.NotificationID !== notificationID));
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
        }
    };

    const handleReadNotification = async (notificationID) => {
        try {
            await axios.post('http://localhost:5000/api/admin/usernotifications', {
                EmployeeID: EmployeeID,
                NotificationID: notificationID,
                IsRead: 1,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUserNotifications((prev) => [
                ...prev,
                { EmployeeID, NotificationID: notificationID, IsRead: 1, IsDeleted: 0 }
            ]);

            fetchUnreadCount();
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
        }
    };

    const isNotificationRead = (notificationID) => {
        return usernotifications.some(
            (userNoti) =>
                userNoti.NotificationID === notificationID &&
                userNoti.EmployeeID === EmployeeID &&
                userNoti.IsRead === 1 &&
                userNoti.IsDeleted === 0
        );
    };

    const handleMarkAllRead = async () => {
        try {
            const employeeNotifications = notifications.filter(noti => noti.sentID === EmployeeID || noti.receivedID === EmployeeID);

            const newReadNotifications = employeeNotifications.filter(noti =>
                !usernotifications.some(uNoti => uNoti.NotificationID === noti.NotificationID)
            ).map(noti => ({
                EmployeeID: EmployeeID,
                NotificationID: noti.NotificationID,
                IsDeleted: 0,
                IsRead: 1,
            }));

            if (newReadNotifications.length > 0) {
                await Promise.all(newReadNotifications.map(noti =>
                    fetch('http://localhost:5000/api/admin/usernotifications', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(noti),
                    })
                ));
            }

            setUserNotifications(prev => [
                ...prev.map(noti => ({ ...noti, IsRead: 1 })), // Cập nhật thông báo cũ
                ...newReadNotifications // Thêm thông báo mới chưa có
            ]);

            // Cập nhật số lượng chưa đọc
            fetchUnreadCount();
            message.success('Tất cả thông báo đã được đánh dấu là đã đọc!');
        } catch (error) {
            console.error('Lỗi khi cập nhật thông báo:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key='add-new' onClick={handleAddNew}>
                Gửi thông báo mới
            </Menu.Item>
            <Menu.Item key='mark-all-read' onClick={handleMarkAllRead}>
                Đánh dấu tất cả là đã đọc
            </Menu.Item>
        </Menu>
    );

    const renderNotificationTitle = (noti) => {
        let tagColor = '';
        let tagText = '';

        if (noti.sentID === EmployeeID) {
            tagColor = 'blue';
            tagText = 'Gửi đi';
        } else if (noti.receivedID === EmployeeID || (noti.receivedID !== EmployeeID && noti.receivedID === 'All')) {
            tagColor = 'green';
            tagText = 'Nhận được';
        }

        return (
            <>
                {tagText && <Tag style={{ fontSize: '10px', margin: '0 10px' }} color={tagColor}>{tagText}</Tag>}
            </>
        );
    };

    return (
        <div style={{ borderRadius: '15px', width: '96%', margin: '20px 2%', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '9px 20px 12px 20px', fontWeight: '500px' }}>
                <Flex justify='space-between'>
                    <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', fontSize: '16px' }}>
                        Danh sách thông báo
                    </Typography.Title>

                    <Flex align="center" gap={8}>
                        <Select
                            value={filterType}
                            onChange={setFilterType}
                            style={{ width: 170 }}
                        >
                            <Option value='all'>Tất cả</Option>
                            <Option value='sent'>Thông báo gửi đi</Option>
                            <Option value='received'>Thông báo nhận</Option>
                            <Option value='expired'>Thông báo hết hạn</Option>
                        </Select>

                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button icon={<EllipsisOutlined />} style={{ border: 0, fontSize: '17px' }} />
                        </Dropdown>
                    </Flex>
                </Flex>
            </div>

            <hr style={{ margin: '-10px 20px 10px 20px' }} />

            <List
                itemLayout='vertical'
                dataSource={filteredStatuses}
                style={{ maxHeight: '76vh', padding: '0 20px 20px 20px', overflowY: 'auto' }}
                renderItem={(item) => (
                    <List.Item
                        key={item.NotificationID}
                        style={{ backgroundColor: isNotificationRead(item.NotificationID) ? 'transparent' : '#e6f7ff', padding: '5px 20px' }}
                        onClick={() => handleOpenNotification(item)}
                    >
                        <Flex justify='space-between' align='center' style={{ width: '100%' }}>
                            <Flex align='center' gap={8}>
                                <Badge dot={!isNotificationRead(item.NotificationID)}>
                                    <span style={{ fontWeight: !isNotificationRead(item.NotificationID) ? 'bold' : 'normal', fontSize: '12px' }}>
                                        {item.Title} - {dayjs(item.ExpiredAt).format('DD/MM/YYYY')}
                                    </span>
                                </Badge>
                                {renderNotificationTitle(item)}
                            </Flex>

                            <Flex gap={12}>
                                {!isNotificationRead(item.NotificationID) && (
                                    <Tooltip title='Đánh dấu đã đọc'>
                                        <Button
                                            type='text'
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReadNotification(item.NotificationID);
                                            }}
                                        />
                                    </Tooltip>
                                )}
                                <Tooltip title='Xóa thông báo'>
                                    <Button
                                        type='text'
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(item.NotificationID);
                                        }}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    </List.Item>
                )}
            />
            {selectedNotification && (
                <div style={{
                    position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
                    background: 'white', padding: '10px 20px 20px 20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                    width: '400px', zIndex: 1000
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                        <h4 style={{ margin: 0 }}>{selectedNotification.Title}</h4>
                        <Button
                            type='text'
                            icon='✖'
                            onClick={() => setSelectedNotification(null)}
                            style={{ fontSize: '16px', color: 'red' }}
                        />
                    </div>

                    <p style={{ float: 'left', fontSize: '10px', marginTop: '2px' }}>({selectedNotification.Type})</p>
                    <p style={{ float: 'right', fontSize: '10px', marginTop: '2px' }}>Ngày gửi: {dayjs(selectedNotification.CreatedAt).format('DD/MM/YYYY')}</p>
                    <p style={{ marginTop: '23px', fontSize: '13px' }}>{selectedNotification.Message}</p>
                </div>
            )}

            {/* Gửi thông báo */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>📩 Gửi Thông Báo</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered >
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Người nhận' name='receivedID' rules={[{ required: true, message: 'Vui lòng chọn người nhận!' }]}>
                        <Select placeholder='Chọn nhân viên nhận thông báo'>
                            <Select.Option key='All' value='All'>
                                Mọi người
                            </Select.Option>
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    {emp.FullName} ({emp.WorkEmail})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Tiêu đề' name='Title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder='Nhập tiêu đề thông báo...' />
                    </Form.Item>

                    <Form.Item label='Loại thông báo' name='Type'>
                        <Select placeholder='Chọn loại thông báo'>
                            <Select.Option value='Chung'>📢 Thông báo chung</Select.Option>
                            <Select.Option value='Khẩn cấp'>⚠️ Khẩn cấp</Select.Option>
                            <Select.Option value='Nhắc nhở'>🔔 Nhắc nhở</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label='Nội dung' name='Message' rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                        <Input.TextArea rows={4} placeholder='Nhập nội dung thông báo...' />
                    </Form.Item>

                    <Form.Item label='Thời hạn' name='ExpiredAt'>
                        <DatePicker placeholder='Chọn thời gian hết hạn' style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default Notifications;
