import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { FilePdfOutlined, SolutionOutlined, DollarOutlined, DeploymentUnitOutlined, FilePptOutlined, TeamOutlined, ClusterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminHome = ({ employees, employeecontracts }) => {
  const navigate = useNavigate();

  const data = [
    { title: 'Nhân sự', value: employees.length, color: '#ffc226', icon: <TeamOutlined />, path: '../employees' },
    { title: 'Hợp đồng lao động', value: employeecontracts.length, color: '#33ad39', icon: <SolutionOutlined />, path: '../contracts' },
    { title: 'Lương', value: 5, color: '#03A9F4', icon: <DollarOutlined /> },
    { title: 'Bộ phận', value: 2, color: '#f63838', icon: <DeploymentUnitOutlined /> },
    { title: 'Phòng ban', value: 0, color: '#b12dd4', icon: <ClusterOutlined /> },
    { title: 'Bảo hiểm', value: 2, color: '#f14881', icon: '' },
    { title: 'Chính sách', value: 5, color: '#E91E63', icon: <FilePptOutlined /> },
    { title: 'Báo cáo', value: 0, color: '#00E676', icon: <FilePdfOutlined /> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {data.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              style={{
                background: item.color,
                color: '#fff',
                borderRadius: 0,
                height: 120,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                position: 'relative'
              }}
              bodyStyle={{ padding: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={2} style={{ color: '#fff', marginBottom: 0 }}>{item.value}</Title>
                  <Text style={{ color: '#fff', fontSize: 16 }}>{item.title}</Text>
                </div>
                <div style={{ fontSize: 40, opacity: 0.3 }}>{item.icon}</div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <Button type='link' style={{ color: '#fff', fontSize: 14, border: 'white' }} onClick={() => item.path && navigate(item.path)}>
                  Chi tiết →
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminHome;
