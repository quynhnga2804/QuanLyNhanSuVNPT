import { Table, Flex, Modal, Descriptions, message, Space, Button } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const AttendanceUser = ({employeeinfo}) => {
    const [attendanceUser, setAttendanceUser] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const token = localStorage.getItem('token');
    const today = dayjs().format('YYYY-MM-DD');

    const showModal = (record) => {
        setSelectedAttendance(record);
        setIsShowModalOpen(true);
    };

    const closeModal = () => {
        setIsShowModalOpen(false);
        setSelectedAttendance(null);
    };

    useEffect(() => {
        if (token)
            fetchAttendenceUser();
    }, [token]);

    const fetchAttendenceUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/attendances', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAttendanceUser(response.data);
        } catch (error) {
            message.error("Không lấy được dữ liệu chấm công!");
        }
    };

    const checkExistingCheckIn = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/attendances`, 
            { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.filter(record => dayjs(record.AttendancesDate).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")).length > 0) {
                message.warning("Bạn đã check in hôm nay rồi!");
                return false;
            }
            return true;

        } catch (error) {
            return false;
        }
    };

    const handleCheckin = async () => {
        if (!navigator.geolocation) {
            message.error("Trình duyệt không hỗ trợ GPS");
            return;
        }
    
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords; // Fix lỗi tên biến
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                if (!response.ok) throw new Error("Không thể lấy địa chỉ!");
    
                const data = await response.json();
                const checkInLocation = data.display_name;

                const canCheckIn = await checkExistingCheckIn();
                if (!canCheckIn) return;
                const checkinTime = dayjs().format('HH:mm:ss');
                const res = await axios.post(`http://localhost:5000/api/user/checkin`, 
                    {
                        EmployeeID: employeeinfo?.EmployeeID, 
                        checkInLocation: checkInLocation,
                        AttendancesDate: today, 
                        CheckInTime: checkinTime,
                    }, 
                    { headers: { Authorization: `Bearer ${token}` } } 
                );
                message.success(res.data.message);
                await fetchAttendenceUser(); 
            } catch (error) {
                message.error("Lỗi khi lấy vị trí hoặc lỗi check-in!");
            }
    
        }, (error) => {
            message.error("Không thể lấy vị trí GPS!");
        });
    };

    const handleCheckout = async () => {
        if (!navigator.geolocation) {
            message.error("Trình duyệt không hỗ trợ GPS");
            return;
        }
    
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords; // Fix lỗi tên biến
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                
                if (!response.ok) throw new Error("Không thể lấy địa chỉ!");
    
                const data = await response.json();
                const checkOutLocation = data.display_name;

                const existingCheckout = attendanceUser.find(att => dayjs(att.AttendancesDate).format("YYYY-MM-DD") === today);

                if (!existingCheckout || !existingCheckout?.CheckInTime) {
                    message.warning("Bạn chưa check in nên không thể check out!");
                    return;
                }
                if (existingCheckout?.CheckOutTime) {
                    message.warning('Bạn đã check out rồi!');
                    return;
                }

                const checkInTime = dayjs(`${today} ${existingCheckout?.CheckInTime}`);
                const checkOutTime = dayjs(`${today} ${dayjs().format('HH:mm:ss')}`);
                const totalSecondsWorked = checkOutTime.diff(checkInTime, 'second'); 
                const totalHoursWorked = totalSecondsWorked / 3600;  
                const res = await axios.put(`http://localhost:5000/api/user/checkout`, 
                    {
                        EmployeeID: employeeinfo?.EmployeeID, 
                        today: today,
                        checkOutLocation: checkOutLocation, 
                        TotalHoursWorked: totalHoursWorked,
                        CheckOutTime: dayjs().format('HH:mm:ss')
                    }, 
                    { headers: { Authorization: `Bearer ${token}` } } 
                );
                message.success(res.data.message);
                await fetchAttendenceUser();
    
            } catch (error) {
                message.error("Lỗi khi lấy vị trí hoặc lỗi check-out!");
            }
    
        }, (error) => {
            message.error("Không thể lấy vị trí GPS!");
        });
    };
    

    const filteredAttendanceUser = attendanceUser.filter(att => {
        if (dateRange && dateRange.length === 2) {
            const date = dayjs(att.AttendancesDate);
            return date.isSameOrAfter(dateRange[0].startOf('day')) && date.isSameOrBefore(dateRange[1].endOf('day'));
        }
        return true;
    });
    

    const columns = [
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'Employee',
            width: 150,
            fixed: 'left',
            align: 'center',
            ellipsis: true,
            render: (employee) => employee?.FullName || '',
        },
        {
            title: 'NGÀY CHẤM CÔNG',
            dataIndex: 'AttendancesDate',
            width: 130,
            align: 'center',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a, b) => new Date(a.AttendancesDate) - new Date(b.AttendancesDate),
        },
        {
            title: 'NGÀY TRONG TUẦN',
            dataIndex: 'AttendancesDate',
            width: 130,
            align: 'center',
            render: (date) => {
                const d = new Date(date);
                const dayOfWeek = d.getDay();
                const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                return days[dayOfWeek];
            }
        },
        {
            title: 'GIỜ VÀO',
            dataIndex: 'CheckInTime',
            width: 100,
            align: 'center',
        },
        {
            title: 'GIỜ RA',
            dataIndex: 'CheckOutTime',
            width: 100,
            align: 'center',
        },
        {
            title: 'TỔNG GIỜ LÀM VIỆC',
            dataIndex: 'TotalHoursWorked',
            width: 150,
            align: 'center',
            sorter: (a, b) => a.TotalHoursWorked - b.TotalHoursWorked,
        }
    ];
    return (
        <Flex vertical style={{ width: '100%' }}>
            <Flex justify='end' style={{ padding: '10px 20px 0 20px', backgroundColor: '#f0f0f1'}}>
                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px',  }}>
                    <DatePicker.RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => setDateRange(dates)}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        allowClear
                        
                    />
                    <Space>
                        <Button type='primary'
                            onClick={handleCheckin}> <LoginOutlined /> Checkin </Button>
                    </Space>
                    <Space>
                        <Button type='primary'
                            onClick={handleCheckout}> <LogoutOutlined /> Checkout </Button>
                    </Space>
                </Flex>
                
            </Flex>

            <Table
                className='table_TQ'
                columns={columns}
                dataSource={filteredAttendanceUser}
                onRow={(record) => ({ onDoubleClick: () => showModal(record), })}
                bordered
                size='medium'
                scroll={{
                    x: 1200, // đủ lớn để không bị díu
                    y: 52.8 * 9,
                }}
                pagination={false}
            />

            {/* Xem chi tiết tăng ca */}
            <Modal className='descriptions' title={<div style={{ textAlign: 'center', width: '100%', margin:'1rem 0 2rem 0' }}>Chi Tiết Chấm Công</div>} open={isShowModalOpen} onCancel={closeModal} footer={null} width={700} centered>
                {selectedAttendance && (
                    
                    <Descriptions column={2} size="middle" labelStyle={{width:'150px'}}>
                        <Descriptions.Item label="Mã Chấm Công" labelCol={'120px'}>
                            {selectedAttendance.ID_Attendance}
                        </Descriptions.Item>
                        <Descriptions.Item label="Checkin Time">
                            {selectedAttendance.CheckInTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã Nhân Viên">
                            {selectedAttendance.EmployeeID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Checkin Location">
                            {selectedAttendance.CheckInLocation}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Nhân Viên">
                            {selectedAttendance.Employee?.FullName || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Checkout Time">
                            {selectedAttendance.CheckOutTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Chấm Công">
                            {selectedAttendance.AttendancesDate ? dayjs(selectedAttendance.AttendancesDate).format("YYYY-MM-DD") : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Checkout Location">
                            {selectedAttendance.CheckOutLocation}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng giờ làm">
                            {selectedAttendance.TotalHoursWorked}
                        </Descriptions.Item>
                        
                    </Descriptions>
                        
                )}
            </Modal>
        </Flex>
    );
};
export default AttendanceUser;
