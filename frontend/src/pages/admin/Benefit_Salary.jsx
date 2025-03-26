import { Table, Select, Input, Form, Flex, Typography, Space, Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const Benefit_Salary = ({ familyMembers, overtimes, fetchMonthlySalaries, monthlysalaries, employees, payrollcycles, jobprofiles }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();

    const filteredPayrollCycles = monthlysalaries.filter(mont => {
        const employee = employees.find(emp => emp.EmployeeID === mont.EmployeeID);
        const fullName = employee ? employee.FullName.toLowerCase() : '';

        return (
            fullName.includes(searchQuery)
        ) && (statusFilter ? mont.status === statusFilter : true);
    });

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    const columns = [
        {
            title: 'MÃ LƯƠNG',
            dataIndex: 'ID_Salary',
            align: 'center',
        },
        {
            title: 'TÊN NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            fixed: 'left',
            minWidth: 116,
            filterSearch: true,
            render: (id) => {
                const employee = employees.find(emp => emp.EmployeeID === id);
                return employee ? employee.FullName : 'Không xác định';
            },
        },
        {
            title: 'CHU KỲ',
            dataIndex: 'ID_PayrollCycle',
            minWidth: 68,
            align: 'right',
            render: (id) => {
                const payrollcycle = payrollcycles.find(payr => payr.ID_PayrollCycle === id);
                return payrollcycle ? payrollcycle.PayrollName : 'Không xác định';
            },
        },
        {
            title: 'LƯƠNG CƠ BẢN',
            dataIndex: 'EmployeeID',
            minWidth: 118,
            align: 'right',
            filterSearch: true,
            render: (id) => {
                const jobprofile = jobprofiles.find(jobp => jobp.EmployeeID === id);
                return jobprofile ? new Intl.NumberFormat('vi-VN').format(jobprofile.BaseSalary) : '0';
            },
        },
        {
            title: 'PHỤ CẤP',
            dataIndex: 'EmployeeID',
            minWidth: 70,
            align: 'right',
            filterSearch: true,
            render: (id) => {
                const jobprofile = jobprofiles.find(jobp => jobp.EmployeeID === id);
                return jobprofile ? new Intl.NumberFormat('vi-VN').format(jobprofile.Allowance) : 'Không xác định';
            },
        },
        {
            title: 'BẢO HIỂM',
            dataIndex: 'InsuranceFee',
            minWidth: 70,
            align: 'right',
            filterSearch: true,
            render: (value) => new Intl.NumberFormat('vi-VN').format(value),
        },
        {
            title: 'THUẾ',
            dataIndex: 'TaxPayable',
            minWidth: 70,
            align: 'right',
            filterSearch: true,
            render: (value) => new Intl.NumberFormat('vi-VN').format(value),
        },
        {
            title: 'PHẠT',
            dataIndex: 'Forfeit',
            minWidth: 70,
            align: 'right',
            render: (value) => new Intl.NumberFormat('vi-VN').format(value),
        },
        {
            title: 'THƯỞNG',
            dataIndex: 'PrizeMoney',
            minWidth: 77,
            align: 'right',
            render: (value) => new Intl.NumberFormat('vi-VN').format(value),
        },
        {
            title: 'LƯƠNG OT',
            dataIndex: 'TotalOTSalary',
            minWidth: 89,
            align: 'right',
            render: (value) => new Intl.NumberFormat('vi-VN').format(value),
        },
        {
            title: 'THỰC LĨNH',
            dataIndex: 'NetSalary',
            minWidth: 89,
            align: 'right',
            render: (value) => new Intl.NumberFormat('vi-VN').format(value),
        },
        {
            title: 'NGÀY TÍNH LƯƠNG',
            dataIndex: 'PaymentDate',
            minWidth: 140,
            align: 'right',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 106,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)} style={{ border: 'none', height: '20px', width: '40px' }}><EditOutlined /></Button>
                    <Button type="link" danger onClick={() => handleDelete(record)} style={{ border: 'none', height: '20px', width: '40px' }}><DeleteOutlined /></Button>
                </>
            ),
        }
    ].filter(col => col.dataIndex !== 'ID_Salary');

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const handleAddNew = () => {
        setIsAddModalOpen(true);
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();
            const token = localStorage.getItem('token');

            const totalOT = addForm.getFieldValue('TotalOT') || 0;
            const totalOTSalary = totalOT * 200000;

            const selectedEmployee = jobprofiles.find(job => job.EmployeeID === values.EmployeeID);
            const baseSalary = selectedEmployee ? +selectedEmployee.BaseSalary : 0;
            const allowance = selectedEmployee ? +selectedEmployee.Allowance : 0;
            const insuranceFee = baseSalary * 0.105;

            const personalReduction = 11000000;
            const familyMemberCounts = familyMembers.filter(fam => fam.EmployeeID === values.EmployeeID).length || 0;
            const dependentReduction = 4400000 * (familyMemberCounts || 0);

            // Tính tổng thu nhập
            const grossIncome = baseSalary + allowance + totalOTSalary + (+values.PrizeMoney || 0);

            // Tính thu nhập chịu thuế
            const taxableIncome = grossIncome - personalReduction - dependentReduction - (+values.Forfeit || 0);

            // Nếu thu nhập chịu thuế < 0, không phải đóng thuế
            const taxPayable = taxableIncome > 0 ? calculateTax(taxableIncome) : 0;

            const netSalary = grossIncome - taxPayable - insuranceFee - (+values.Forfeit || 0);
            const paymentDate = dayjs().format('YYYY-MM-DD');

            const data = {
                EmployeeID: values.EmployeeID,
                ID_PayrollCycle: values.ID_PayrollCycle,
                InsuranceFee: insuranceFee,
                TaxPayable: taxPayable,
                Forfeit: values.Forfeit || 0,
                PrizeMoney: values.PrizeMoney || 0,
                TotalOTSalary: totalOTSalary,
                NetSalary: netSalary,
                PaymentDate: paymentDate,
            };

            // Gửi dữ liệu lên server
            await axios.post('http://localhost:5000/api/admin/monthlysalaries', data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchMonthlySalaries();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    // Hàm tính thuế theo biểu thuế lũy tiến
    const calculateTax = (income) => {
        const taxBrackets = [
            { limit: 5000000, rate: 0.05 },   // 5% cho 5 triệu đầu
            { limit: 5000000, rate: 0.10 },   // 10% cho 5 triệu tiếp theo
            { limit: 8000000, rate: 0.15 },   // 15% cho 8 triệu tiếp theo
            { limit: 14000000, rate: 0.20 },  // 20% cho 14 triệu tiếp theo
            { limit: 20000000, rate: 0.25 },  // 25% cho 20 triệu tiếp theo
            { limit: 28000000, rate: 0.30 },  // 30% cho 28 triệu tiếp theo
            { limit: Infinity, rate: 0.35 },  // 35% cho phần còn lại
        ];

        let tax = 0;
        let remainingIncome = income;

        for (const bracket of taxBrackets) {
            if (remainingIncome <= 0) break;
            const taxableAmount = Math.min(remainingIncome, bracket.limit);
            tax += taxableAmount * bracket.rate;
            remainingIncome -= taxableAmount;
        }

        return tax;
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            const token = localStorage.getItem('token');

            const totalOT = editForm.getFieldValue('TotalOT') || 0;
            const totalOTSalary = totalOT * 200000;

            const selectedEmployee = jobprofiles.find(job => job.EmployeeID === values.EmployeeID);
            const baseSalary = selectedEmployee ? +selectedEmployee.BaseSalary : 0;
            const allowance = selectedEmployee ? +selectedEmployee.Allowance : 0;
            const insuranceFee = baseSalary * 0.105;

            const personalReduction = 11000000;
            const familyMemberCounts = familyMembers.filter(fam => fam.EmployeeID === values.EmployeeID).length || 0;
            const dependentReduction = 4400000 * (familyMemberCounts || 0);

            const grossIncome = baseSalary + allowance + totalOTSalary + (+values.PrizeMoney || 0);

            const taxableIncome = grossIncome - personalReduction - dependentReduction - (+values.Forfeit || 0);
            const taxPayable = taxableIncome > 0 ? calculateTax(taxableIncome) : 0;

            const netSalary = grossIncome - taxPayable - insuranceFee - (+values.Forfeit || 0);
            const paymentDate = dayjs().format('YYYY-MM-DD');

            const data = {
                ID_Salary: values.ID_Salary,
                EmployeeID: values.EmployeeID,
                ID_PayrollCycle: values.ID_PayrollCycle,
                InsuranceFee: insuranceFee,
                TaxPayable: taxPayable,
                Forfeit: values.Forfeit || 0,
                PrizeMoney: values.PrizeMoney || 0,
                TotalOTSalary: totalOTSalary,
                NetSalary: netSalary,
                PaymentDate: paymentDate,
            };

            await axios.put(`http://localhost:5000/api/admin/monthlysalaries/${values.ID_Salary}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchMonthlySalaries();
            message.success('Cập nhật thành công!');
            handleEditCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };
    
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

    const handleEdit = (record) => {
        editForm.setFieldsValue({
            ID_Salary: record.ID_Salary,
            EmployeeID: record.EmployeeID,
            ID_PayrollCycle: record.ID_PayrollCycle,
            InsuranceFee: record.InsuranceFee ? Number(record.InsuranceFee) : 0,
            TaxPayable: record.TaxPayable ? Number(record.TaxPayable) : 0,
            Forfeit: record.Forfeit ? Number(record.Forfeit) : 0,
            PrizeMoney: record.PrizeMoney ? Number(record.PrizeMoney) : 0,
            TotalOT: record.TotalOTSalary ? (Number(record.TotalOTSalary) / 200000).toFixed(2) : 0,
            TotalOTSalary: record.TotalOTSalary ? Number(record.TotalOTSalary) : 0,
            NetSalary: record.NetSalary ? Number(record.NetSalary) : 0,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa dữ liệu lương này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/monthlysalaries/${record.ID_Salary}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(`Xóa thành công!`);
                    fetchMonthlySalaries();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handlePayrollCycleChange = (value) => {
        const employeeID = addForm.getFieldValue('EmployeeID');

        if (!employeeID) {
            message.warning("Vui lòng chọn nhân viên trước!");
            return;
        }

        const totalOT = overtimes
            .filter(ot => ot.ID_PayrollCycle === value && ot.EmployeeID === employeeID)
            .reduce((sum, ot) => sum + (ot.OverTimesHours || 0), 0);

        // Cập nhật lương OT vào form
        addForm.setFieldsValue({
            TotalOT: totalOT,
            TotalOTSalary: totalOT * 200000,
        });
    };

    // Cập nhật TotalOTSalary khi nhập TotalOT
    const handleTotalOTChange = (e) => {
        const totalOT = parseInt(e.target.value, 10) || 0;
        addForm.setFieldsValue({
            TotalOTSalary: totalOT * 200000,
        });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    Số lượng: {filteredPayrollCycles.length}
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    <Button type='primary' onClick={handleAddNew}>
                        <Space>
                            Tạo mới <UserAddOutlined />
                        </Space>
                    </Button>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={columns}
                dataSource={filteredPayrollCycles.map(emp => ({ ...emp, key: emp.ID_Salary }))}
                bordered
                size='midium'
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
                onChange={onChange}
            />

            {/* Thêm mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Bảng Lương</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered >
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Nhân viên' name='EmployeeID' rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
                        <Select placeholder="Chọn nhân viên">
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    {emp.FullName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Chu kỳ lương' name='ID_PayrollCycle' rules={[{ required: true, message: 'Vui lòng chọn chu kỳ lương!' }]}>
                        <Select placeholder="Chọn chu kỳ lương" onChange={handlePayrollCycleChange}>
                            {payrollcycles.map(payroll => (
                                <Select.Option key={payroll.ID_PayrollCycle} value={payroll.ID_PayrollCycle}>
                                    {payroll.PayrollName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Phạt' name='Forfeit' rules={[{ required: false, pattern: /^[0-9]+$/, message: 'Vui lòng nhập số hợp lệ!' }]}>
                        <Input type='number' placeholder='Nhập số tiền phạt' />
                    </Form.Item>

                    <Form.Item label='Thưởng' name='PrizeMoney' rules={[{ required: false, pattern: /^[0-9]+$/, message: 'Vui lòng nhập số hợp lệ!' }]}>
                        <Input type='number' placeholder='Nhập tiền thưởng' />
                    </Form.Item>

                    <Form.Item label='Tổng giờ OT' name='TotalOT'>
                        <Input type='number' onChange={handleTotalOTChange} disabled />
                    </Form.Item>

                    <Form.Item label='Lương OT' name='TotalOTSalary'>
                        <Input type='number' disabled />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Sửa lương */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Bảng Lương</div>} open={isEditModalOpen} onOk={handleEditSave} onCancel={handleEditCancel} centered >
                <Form form={editForm} layout='vertical'>
                    <Form.Item label='ID Lương' name='ID_Salary' hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Nhân viên' name='EmployeeID' rules={[{ required: true }]}>
                        <Select placeholder="Chọn nhân viên" disabled>
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    {emp.FullName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Chu kỳ lương' name='ID_PayrollCycle' rules={[{ required: true }]}>
                        <Select placeholder="Chọn chu kỳ lương" onChange={handlePayrollCycleChange}>
                            {payrollcycles.map(payroll => (
                                <Select.Option key={payroll.ID_PayrollCycle} value={payroll.ID_PayrollCycle}>
                                    {payroll.PayrollName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Phạt' name='Forfeit' rules={[{ required: false, pattern: /^[0-9]+$/, message: 'Vui lòng nhập số hợp lệ!' }]}>
                        <Input type='number' placeholder='Nhập số tiền phạt' />
                    </Form.Item>

                    <Form.Item label='Thưởng' name='PrizeMoney' rules={[{ required: false, pattern: /^[0-9]+$/, message: 'Vui lòng nhập số hợp lệ!' }]}>
                        <Input type='number' placeholder='Nhập tiền thưởng' />
                    </Form.Item>

                    <Form.Item label='Tổng giờ OT' name='TotalOT'>
                        <Input type='number' onChange={handleTotalOTChange} disabled />
                    </Form.Item>

                    <Form.Item label='Lương OT' name='TotalOTSalary'>
                        <Input type='number' disabled />
                    </Form.Item>

                    <Form.Item label='Lương thực lĩnh (Net Salary)' name='NetSalary'>
                        <Input type='number' disabled />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Benefit_Salary;