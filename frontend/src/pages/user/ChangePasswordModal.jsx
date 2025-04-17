import React, { useState, useEffect, useContext } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { ModalContext } from "../../api/ModalContext";
import axios from "axios";

const ChangePasswordModal = ({ visible, onClose, messageText, isForced }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [fieldsDisabled, setFieldsDisabled] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const { setIsForcedChange, setModalMessage } = useContext(ModalContext);
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!visible) {
            form.resetFields(); // Reset form khi đóng modal
            setOtpSent(false);
            setFieldsDisabled(false);
            setPasswordChanged(false);
        }
    }, [visible]);

    const checkPass = (pass) => {
        const lengthValid = pass.length >= 8 && pass.length <= 15;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasSpecialChar = /[!@#%^&*(),.?":{}|<>\/]/.test(pass);
        return lengthValid && hasUpperCase && hasLowerCase && hasSpecialChar;
    };

    const sendOTP = async () => {
        setLoading(true);
        try {
            await form.validateFields(["oldPassword", "newPassword", "confirmPassword"]); 
            const oldPassword = form.getFieldValue("oldPassword");
            const newPassword = form.getFieldValue("newPassword");
            const confirmPassword = form.getFieldValue("confirmPassword");
            if (!checkPass(newPassword) || !checkPass(confirmPassword)) {
                message.error("Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in thường, 1 chữ in hoa và 1 ký tự đặc biệt!");
                return;
            }
            if (newPassword !== confirmPassword) {
                message.error("Mật khẩu nhập lại không khớp! Vui lòng nhập lại!");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/user/send-otp",
                { 
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            message.success("OTP đã được gửi! Hãy kiểm tra email của bạn!");
            setOtpSent(true);
            setFieldsDisabled(true); 
            startCountdown();
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi gửi OTP");
        } finally {
            setLoading(false);
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
            setIsForcedChange(false);
            setModalMessage("");
            localStorage.removeItem("forceChangePass");
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
        }
    };

    return (
        <Modal
            title="Đổi mật khẩu"
            open={visible}
            onCancel={!isForced && !passwordChanged ? onClose : null} // Chặn đóng modal khi đổi mật khẩu thành công
            footer={null}
            closable={!isForced || !passwordChanged} // Không hiển thị nút X khi đổi mật khẩu thành công
            style={{ textAlign: "center" }}
        >
            {messageText && (
                <div style={{ marginBottom: 16, color: 'red', fontWeight: 500 }}>
                    {messageText}
                </div>
            )}
            {passwordChanged ? (
                <div>
                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "green" }}>Đổi mật khẩu thành công! Vui lòng đăng nhập lại!</p>
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
                        rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu mới" }]}
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
                        <Button type="primary" onClick={sendOTP} loading={loading}>
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
