import React, { useState, useEffect, useContext } from 'react';
import { Button, Checkbox, Form, Image, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../api/api';
import logo from '../assets/images/logo.png';

const Login = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [token, setToken] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const role = JSON.parse(localStorage.getItem('user')).role;
      if (role === 'Admin') {
        navigate('/admin/*');
      } else if (role === 'User') {
        navigate('/user/home');
      } else {
        navigate('/unauthorized');
      }
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage('');

    try {
      if (!showOtpField) {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'Application/json' },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');

        localStorage.setItem('tempToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        await sendOtp(values.email);
      } else {
        const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'Application/json' },
          body: JSON.stringify({ token, otp: values.otp }),
        });

        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) throw new Error(verifyData.message || 'Xác minh OTP thất bại');

        if (verifyData.token) {
          localStorage.setItem('token', verifyData.token);
          setToken(verifyData.token);
          message.success('Đăng nhập thành công!');
          localStorage.removeItem('tempToken');

          const user = JSON.parse(localStorage.getItem('user'));
          localStorage.setItem('username', user.name);
          navigate('/');
        } else {
          console.error('Token không hợp lệ');
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email) => {
    try {
      const otpResponse = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify({ email, tokenA: localStorage.getItem('tempToken') }),
      });

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) throw new Error(otpData.message || 'Gửi OTP thất bại');

      setToken(otpData.token);
      setShowOtpField(true);
      setCountdown(60);
      message.info('OTP đã được gửi đến email của bạn');
    } catch (error) {
      setErrorMessage(error.message);
      message.error(error.message);
    }
  };

  return (
    <div className='login'>
      <Form
        form={form}
        name='loginForm'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 26 }}
        style={{ minWidth: 400, maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item style={{ textAlign: 'center' }}>
          <Image src={logo} width={60} height={60} />
        </Form.Item>

        <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
          <Input placeholder='example@gmail.com' disabled={showOtpField} />
        </Form.Item>

        <Form.Item label='Mật khẩu' name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password disabled={showOtpField} />
        </Form.Item>

        {showOtpField && (
          <>
            <Form.Item label='OTP' name='otp' rules={[{ required: true, message: 'Vui lòng nhập OTP!' }]}>
              <Input placeholder='Nhập mã OTP' />
            </Form.Item>

            <p style={{ textAlign: 'center', color: 'gray' }}>
              {countdown > 0 ? `OTP sẽ hết hạn sau ${countdown} giây` : 'OTP đã hết hạn!'}
            </p>
            {countdown === 0 && (
              <Form.Item label={null} style={{ textAlign: 'center' }}>
                <Button type='link' onClick={() => sendOtp(form.getFieldValue('email'))}>
                  Gửi lại OTP
                </Button>
              </Form.Item>
            )}
          </>
        )}

        <Form.Item name='remember' valuePropName='checked' label={null}>
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type='primary' htmlType='submit' loading={loading}>
            {showOtpField ? 'Xác nhận OTP' : 'Đăng nhập'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;