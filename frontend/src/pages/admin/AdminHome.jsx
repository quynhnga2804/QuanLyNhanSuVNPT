import React, { useContext } from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { FilePdfOutlined, SolutionOutlined, DollarOutlined, DeploymentUnitOutlined, TeamOutlined, ClusterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../api/UserContext';

const { Title, Text } = Typography;

const AdminHome = ({ dtEmployees, dtEmployeeContracts, dtDivisions, dtDepartments }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const role = user?. role.toLowerCase();

  const data = [
    role !== 'accountant' ? { title: 'Nhân sự', value: dtEmployees?.length || 0, color: '#ffc226', icon: <TeamOutlined />, path: '../employees' } : null,
    role !== 'accountant' ? { title: 'Hợp đồng lao động', value: dtEmployeeContracts?.length || 0, color: '#33ad39', icon: <SolutionOutlined />, path: '../contracts' } : null,
    role !== 'manager' ? { title: 'Lương', value: 5, color: '#03A9F4', icon: <DollarOutlined />, path: '../periodicsalaries' } : null,
    role !== 'accountant' && role !== 'manager' ? { title: 'Bộ phận', value: dtDivisions?.length, color: '#f63838', icon: <DeploymentUnitOutlined />, path: '../organizationalstructures' } : null,
    role !== 'accountant' ? { title: 'Phòng ban', value: dtDepartments?.length, color: '#b12dd4', icon: <ClusterOutlined /> } : null,
    role !== 'manager' && role !== 'accountant' ? { title: 'Báo cáo', value: 0, color: '#00E676', icon: <FilePdfOutlined /> } : null,
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
