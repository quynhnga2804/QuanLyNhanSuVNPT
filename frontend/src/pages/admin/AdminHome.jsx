import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { FilePdfOutlined, SolutionOutlined, DollarOutlined, DeploymentUnitOutlined, FilePptOutlined, TeamOutlined, ClusterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminHome = ({ dtEmployees, dtEmployeeContracts, dtDivisions, dtDepartments }) => {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem('user'))?. role;

  const data = [
    role !== 'Accountant' ? { title: 'Nhân sự', value: dtEmployees?.length || 0, color: '#ffc226', icon: <TeamOutlined />, path: '../employees' } : null,
    role !== 'Accountant' ? { title: 'Hợp đồng lao động', value: dtEmployeeContracts?.length || 0, color: '#33ad39', icon: <SolutionOutlined />, path: '../contracts' } : null,
    role !== 'Manager' ? { title: 'Lương', value: 5, color: '#03A9F4', icon: <DollarOutlined />, path: '../periodicsalaries' } : null,
    role !== 'Accountant' && role !== 'Manager' ? { title: 'Bộ phận', value: dtDivisions?.length, color: '#f63838', icon: <DeploymentUnitOutlined />, path: '../organizationalstructures' } : null,
    role !== 'Accountant' ? { title: 'Phòng ban', value: dtDepartments?.length, color: '#b12dd4', icon: <ClusterOutlined /> } : null,
    role !== 'Manager' && role !== 'Accountant' ? { title: 'Báo cáo', value: 0, color: '#00E676', icon: <FilePdfOutlined /> } : null,
  ].filter(Boolean);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {data.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index} style={{minWidth: '40vh'}}>
            <Card
              style={{
                background: item?.color,
                color: '#fff',
                borderRadius: 0,
                minHeight: 120,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                position: 'relative'
              }}
              bodyStyle={{ padding: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={2} style={{ color: '#fff', marginBottom: 0 }}>{item?.value}</Title>
                  <Text style={{ color: '#fff', fontSize: 16 }}>{item?.title}</Text>
                </div>
                <div style={{ fontSize: 40, opacity: 0.3 }}>{item?.icon}</div>
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
