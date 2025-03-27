import React, { useState, useEffect, useContext } from 'react';
import { Layout, List, Modal, Button, Typography, Popconfirm, message, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Flex } from 'antd/es';
import { NotificationContext } from './NotificationContext';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function NotificationListUser() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { refreshNotifications } = useContext(NotificationContext);
  const [filterType, setFilterType] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log("📡 Gọi API lấy danh sách thông báo...");
      const response = await axios.get('http://localhost:5000/api/user/notifications', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      console.log("✅ Dữ liệu nhận được:", response.data);
      
      // Lưu notifications và unreadCount
      if (!response.data.notifications) throw new Error("Dữ liệu không hợp lệ");
      setNotifications(response.data.notifications);
    } catch (error) {
      message.error("Không thể tải danh sách thông báo.");
    }
  };

  // Xử lý khi nhấn vào "Chi tiết"
  const handleDetailsClick = async (notification) => {
    try {
      setSelectedNotification(notification);
      await axios.put(`http://localhost:5000/api/user/notifications/${notification.NotificationID}/read`, {}, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setNotifications(notifications.map(n =>
        n.NotificationID === notification.NotificationID ? { ...n, IsRead: true } : n
      ));
    } catch (error) {
      message.error("Không thể đánh dấu đã đọc.");
    }
  };

  // Xử lý khi nhấn "Xóa"
  const handleDeleteClick = async (notification) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/notifications/${notification.NotificationID}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setNotifications(notifications.filter(n => n.NotificationID !== notification.NotificationID));
      message.success("Đã xóa thông báo!");
      refreshNotifications();
    } catch (error) {
      message.error("Xóa thất bại, vui lòng thử lại.");
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
    refreshNotifications();
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const getFilterNoti = () => {
    const now = new Date();
    switch (filterType) {
      case 'new':
        return notifications.filter( n => !n.IsRead);
      case 'expired': 
        return notifications.filter( n => new Date(n.ExpiredAt) < now);
      default: 
        return notifications;
    }
  };

  return (
    <Layout className="home-container">
      <Content style={{ padding: '20px' }}>
        <Flex vertical align="center" style={{ padding: '20px', background: '#f0f2f5' }}>
          <Flex vertical style={{ width: '100%', background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <Flex style={{ justifyContent: 'space-between'}}>
            <Title level={3} style={{ marginBottom: '0px' }}>Danh sách thông báo</Title>
              <Select
                style={{ width: 200 }}
                placeholder="Lọc thông báo"
                onChange={(value) => handleFilterChange(value)} // hàm xử lý lọc
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Mới & chưa xem', value: 'new' },
                  { label: 'Hết hạn', value: 'expired' },
                ]}
              />
            </Flex>
            <hr />
            {getFilterNoti().length === 0 ? (
              <Paragraph style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '1rem', color: '#999' }}>
                Không tìm thấy thông báo!
              </Paragraph>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={getFilterNoti()}
                renderItem={(notification) => (
                  <List.Item key={notification.NotificationID} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '4px', marginBottom: '8px', background: notification.IsRead ? '#fff' : '#e6f7ff'  }}
                    actions={[
                      <Button type="link" size="small" onClick={() => handleDetailsClick(notification)}> {notification.IsRead ? 'Đã xem' : 'Chi tiết'} </Button>,
                      <Popconfirm
                        title="Bạn chắc chắn muốn xóa thông báo này?"
                        onConfirm={() => handleDeleteClick(notification)}
                        okText="Có"
                        cancelText="Không">
                        <Button type="link" danger size="small" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    ]}>
                    <List.Item.Meta 
                      title={
                        <span style={{ color: notification.IsRead ? '#999' : '#000' }}>
                          {`${notification.Title} - ${new Date(notification.ExpiredAt).toLocaleDateString('vi-VN')}`}
                        </span>
                      }
                    />

                  </List.Item>
                )}
              />
            )}
          </Flex>
          {selectedNotification && (
            <Modal
              title={selectedNotification.Title} 
              open={!!selectedNotification}
              onCancel={handleCloseModal}
              footer={[
                // <Button key="back" onClick={handleCloseModal} >Đóng</Button>
              ]}
            >
              <hr/>
              <Flex style={{justifyContent: 'space-between'}}>
                <Paragraph style={{marginTop:'10px', float: 'left'}}>({selectedNotification.Type})</Paragraph>
                <Paragraph style={{marginTop:'10px', float: 'right'}}>Ngày gửi: {selectedNotification.CreatedAt} </Paragraph>
              </Flex>
              <Paragraph>{selectedNotification.Message} </Paragraph>
            </Modal>
          )}
        </Flex>
      </Content>
    </Layout>
  );
}

export default NotificationListUser;
