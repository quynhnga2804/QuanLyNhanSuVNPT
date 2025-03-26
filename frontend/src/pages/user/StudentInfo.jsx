import React from 'react';
import { Card, Avatar, Typography } from 'antd';

const { Title, Text } = Typography;

const StudentInfo = () => {
  return (
    <Card>
      <Avatar size={100} src="student-avatar.jpg" />
      <Title level={4}>LÊ THU HÀ</Title>
      <Text>MSSV: 21103101085</Text><br />
      <Text>Lớp: DHT115A2CL</Text><br />
      <Text>Khóa: 2021-2025</Text><br />
      <Text>... (các thông tin khác)</Text>
    </Card>
  );
};

export default StudentInfo;