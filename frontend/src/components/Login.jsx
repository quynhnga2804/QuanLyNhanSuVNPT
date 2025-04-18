import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Image, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../api/UserContext';
import logo from '../assets/images/logo.png';
import dayjs from 'dayjs';
import { login, verify, sendotp } from '../api/apiService';

const Login = () => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [token, setToken] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { user, setUser } = useContext(UserContext);
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
      const role = user?.role.toLowerCase();

      if (role === 'admin') navigate('/Admin/home');
      else if (role === 'director' || role === 'manager' || role === 'accountant' || role === 'employee')
        navigate('/User/home');
      else navigate('/unauthorized');
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage('');

    try {
      if (!showOtpField) {
        if (!values.email.trim() || !values.password.trim()) {
          message.warning('Vui lòng không nhập khoảng trắng!');
          return;
        }

        const response = await login('/auth/login', values.email, values.password);
        const data = response.data;

        localStorage.setItem('tempToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        await sendOtp(values.email);
      } else {
        const verifyResponse = await verify('/auth/verify-otp', token, values.otp);
        const verifyData = verifyResponse.data;

        if (verifyData.token) {
          localStorage.setItem('token', verifyData.token);
          setToken(verifyData.token);
          message.success('Đăng nhập thành công!');
          localStorage.removeItem('tempToken');

          //kiểm tra đổi mật khẩu
          const lastChanged = dayjs(user?.lastPasswordChange)
          const now = dayjs();
          if (now.diff(lastChanged, "month") >= 3) {
            localStorage.setItem('forceChangePass', 'true');
          }
          navigate('/');
        } else {
          console.error('Token không hợp lệ');
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Xác thực OTP thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email) => {
    try {
      const otpResponse = await sendotp('/auth/send-otp', email, localStorage.getItem('tempToken'));
      const otpData = await otpResponse.data;

      setToken(otpData.token);
      setShowOtpField(true);
      setCountdown(60);
      message.info('OTP đã được gửi đến email của bạn');
    } catch (error) {
      message.error(error.response?.data?.message || 'Gửi OTP thất bại');
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
          <Image src={logo} alt='logo' width={60} height={60} />
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