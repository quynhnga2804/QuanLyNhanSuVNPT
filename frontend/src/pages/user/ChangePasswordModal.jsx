import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import axios from "axios";

const ChangePasswordModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [fieldsDisabled, setFieldsDisabled] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    useEffect(() => {
        if (!visible) {
            form.resetFields(); // Reset form khi đóng modal
            setOtpSent(false);
            setFieldsDisabled(false);
            setPasswordChanged(false);
        }
    }, [visible]);

    const sendOTP = async () => {
        try {
            await form.validateFields(["oldPassword", "newPassword", "confirmPassword"]); 

            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Bạn chưa đăng nhập!");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/user/send-otp",
                { oldPassword: form.getFieldValue("oldPassword") },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            message.success("OTP đã được gửi! Hãy kiểm tra email của bạn!");
            setOtpSent(true);
            setFieldsDisabled(true); 
            startCountdown();
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi gửi OTP");
        }
    };

    const startCountdown = () => {
        let time = 60;
        setCountdown(time);
        const timer = setInterval(() => {
            time -= 1;
            setCountdown(time);
            if (time <= 0) clearInterval(timer);
        }, 1000);
    };

    const handleChangePassword = async (values) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Bạn chưa đăng nhập!");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/user/change-password",
                {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                    otp: values.otp,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            message.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            setPasswordChanged(true);
            localStorage.removeItem("token");
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
        }
    };

    return (
        <Modal
            title="Đổi mật khẩu"
            open={visible}
            onCancel={!passwordChanged ? onClose : null} // Chặn đóng modal khi đổi mật khẩu thành công
            footer={null}
            closable={!passwordChanged} // Không hiển thị nút X khi đổi mật khẩu thành công
            style={{ textAlign: "center" }}
        >
            {passwordChanged ? (
                <div>
                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "green" }}>Đổi mật khẩu thành công!</p>
                    <Button type="primary" onClick={() => (window.location.href = "/login")}  style={{ marginTop: '15px'}}>
                        Đăng nhập lại
                    </Button>
                </div>
            ) : (
                <Form form={form} onFinish={handleChangePassword} layout="vertical">
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
                    >
                        <Input.Password disabled={fieldsDisabled} />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
                    >
                        <Input.Password disabled={fieldsDisabled} />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu mới"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password disabled={fieldsDisabled} />
                    </Form.Item>

                    {otpSent && (
                        <Form.Item
                            label="Nhập OTP"
                            name="otp"
                            rules={[{ required: true, message: "Vui lòng nhập OTP" }]}
                        >
                            <Input />
                        </Form.Item>
                    )}

                    {!otpSent ? (
                        <Button type="primary" onClick={sendOTP}>
                            Gửi OTP
                        </Button>
                    ) : (
                        <Button type="primary" htmlType="submit">
                            Xác nhận đổi mật khẩu
                        </Button>
                    )}

                    {otpSent && countdown > 0 && <p>OTP hết hạn sau {countdown}s</p>}
                    {otpSent && countdown === 0 && (
                        <Button type="link" onClick={sendOTP}>
                            Gửi lại OTP
                        </Button>
                    )}
                </Form>
            )}
        </Modal>
    );
};

export default ChangePasswordModal;
