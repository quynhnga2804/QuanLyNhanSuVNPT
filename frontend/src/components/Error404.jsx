import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status='404'
      title='404'
      subTitle='Xin lỗi, không tìm thấy trang này.'
      extra={<Button type='primary' onClick={() => navigate(-1)}>Quay lại</Button>}
    />
  );
};
export default Error404;