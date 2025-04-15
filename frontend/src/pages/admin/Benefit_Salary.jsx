import { Table, Select, Input, Form, Flex, Typography, Space, Button, Modal, message } from 'antd';
import React, { useState, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { debounce } from 'lodash';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../api/UserContext';
import { post, put, del } from '../../api/apiService';

const Benefit_Salary = ({ familyMembers, insurances, overtimes, fetchMonthlySalaries, monthlysalaries, employees, payrollcycles, jobprofiles, incomeTaxes }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();
    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
    const [selectedPayrollCycleId, setSelectedPayrollCycleId] = useState(null);

    const filteredPayrolls = payrollcycles.filter(pay => pay.Status === 'Đang xử lý').map(pay => ({ id: pay.ID_PayrollCycle, name: pay.PayrollName }));
    const filteredMonthlySalaries = monthlysalaries.filter(mont => {
        const employee = employees.find(emp => emp.EmployeeID === mont.EmployeeID);
        const fullName = employee ? employee.FullName.toLowerCase() : '';

        return (
            mont.ID_PayrollCycle === selectedPayrollCycleId
            && fullName.includes(searchQuery)
        ) && (statusFilter ? mont.status === statusFilter : true);
    });

    const filteredEmployees = jobprofiles.filter(job => {
        if (!selectedPayrollCycleId) return false;

        return !monthlysalaries.some(mont =>
            mont.EmployeeID === job.EmployeeID && mont.ID_PayrollCycle === selectedPayrollCycleId
        );
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
                return employee ? employee.FullName : '';
            },
        },
        {
            title: 'CHU KỲ',
            dataIndex: 'ID_PayrollCycle',
            minWidth: 68,
            align: 'right',
            render: (id) => {
                const payrollcycle = payrollcycles.find(payr => payr.ID_PayrollCycle === id);
                return payrollcycle ? payrollcycle.PayrollName : '';
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
                return jobprofile ? new Intl.NumberFormat('vi-VN').format(jobprofile.Allowance) : '0';
            },
        },
        {
            title: 'BẢO HIỂM',
            dataIndex: 'InsuranceFee',
            minWidth: 72,
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
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
    ].filter(col => col.dataIndex !== 'ID_Salary');

    if (role === 'accountant') {
        columns.push({
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
        });
    }

    const columnEMPs = [
        {
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
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
                return employee ? employee.FullName : '';
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
                return jobprofile ? new Intl.NumberFormat('vi-VN').format(jobprofile.Allowance) : '0';
            },
        },
    ];

    if (role === 'accountant') {
        columnEMPs.push({
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            fixed: 'right',
            align: 'center',
            minWidth: 106,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleAdd(record)} style={{ border: 'none', height: '20px', width: '40px' }}>Tính lương</Button>
                </>
            ),
        });
    }

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const handleAdd = (record) => {
        const totalOT = overtimes
            .filter(ot => ot.ID_PayrollCycle === selectedPayrollCycleId && ot.EmployeeID === record.EmployeeID && ot.Status === 'Approved')
            .reduce((sum, ot) => sum + (+ot.OverTimesHours || 0), 0);

        const totalOTSalary = overtimes
            .filter(ot => ot.ID_PayrollCycle === selectedPayrollCycleId && ot.EmployeeID === record.EmployeeID && ot.Status === 'Approved')
            .reduce((sum, ot) => {
                const profile = jobprofiles.find(jp => jp.EmployeeID === ot.EmployeeID);
                if (!profile) return sum;

                const { BaseSalary, StandardWorkingHours } = profile;
                const hourlyRate = BaseSalary / (StandardWorkingHours * 4);

                let multiplier = 1;
                switch (ot.OTType) {
                    case 'Ngày thường':
                        multiplier = 1.5;
                        break;
                    case 'Cuối tuần':
                        multiplier = 2.0;
                        break;
                    case 'Ngày lễ':
                        multiplier = 3.0;
                        break;
                    default:
                        multiplier = 1;
                }

                return sum + (+ot.OverTimesHours || 0) * multiplier * hourlyRate;
            }, 0);

        addForm.setFieldsValue({
            EmployeeID: record.EmployeeID,
            ID_PayrollCycle: selectedPayrollCycleId,
            TotalOT: totalOT,
            TotalOTSalary: totalOTSalary,
        });
        setIsAddModalOpen(true);
    };

    const handleAddSave = async () => {
        try {
            const values = await addForm.validateFields();

            const totalOTSalary = addForm.getFieldValue('TotalOTSalary') || 0;

            const selectedEmployee = jobprofiles.find(job => job.EmployeeID === values.EmployeeID);
            const baseSalary = selectedEmployee ? +selectedEmployee.BaseSalary : 0;
            const allowance = selectedEmployee ? +selectedEmployee.Allowance : 0;

            // BHXH - BHYT - BHTN
            const employeeInsuranceRate = insurances.reduce((total, ins) => total + parseFloat(ins.Employee), 0);
            const insuranceFee = baseSalary * employeeInsuranceRate;

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

            await post('/admin/monthlysalaries', data);
            fetchMonthlySalaries();
            message.success('Thêm mới thành công!');
            handleAddCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleAddAll = async () => {
        try {
            await Promise.all(filteredEmployees.map(async (emp) => {
                const employeeID = emp.EmployeeID;

                // Tìm thông tin job
                const selectedEmployee = jobprofiles.find(job => job.EmployeeID === employeeID);
                const baseSalary = selectedEmployee ? +selectedEmployee.BaseSalary : 0;
                const allowance = selectedEmployee ? +selectedEmployee.Allowance : 0;

                const totalOTSalary = overtimes
                    .filter(ot => ot.ID_PayrollCycle === selectedPayrollCycleId && ot.EmployeeID === employeeID && ot.Status === 'Approved')
                    .reduce((sum, ot) => {
                        const profile = jobprofiles.find(jp => jp.EmployeeID === ot.EmployeeID);
                        if (!profile) return sum;

                        const { BaseSalary, StandardWorkingHours } = profile;
                        const hourlyRate = BaseSalary / (StandardWorkingHours * 4);

                        let multiplier = 1;
                        switch (ot.OTType) {
                            case 'Ngày thường':
                                multiplier = 1.5;
                                break;
                            case 'Cuối tuần':
                                multiplier = 2.0;
                                break;
                            case 'Ngày lễ':
                                multiplier = 3.0;
                                break;
                            default:
                                multiplier = 1;
                        }

                        return sum + (ot.OverTimesHours || 0) * multiplier * hourlyRate;
                    }, 0);

                // BHXH - BHYT - BHTN
                const employeeInsuranceRate = insurances.reduce((total, ins) => total + parseFloat(ins.Employee), 0);
                const insuranceFee = baseSalary * employeeInsuranceRate;

                const personalReduction = 11000000;
                const familyMemberCounts = familyMembers.filter(fam => fam.EmployeeID === employeeID).length || 0;
                const dependentReduction = 4400000 * familyMemberCounts;

                const prize = 0;
                const forfeit = 0;

                const grossIncome = baseSalary + allowance + totalOTSalary + prize;
                const taxableIncome = grossIncome - personalReduction - dependentReduction - forfeit;
                const taxPayable = taxableIncome > 0 ? calculateTax(taxableIncome) : 0;
                const netSalary = grossIncome - taxPayable - insuranceFee - forfeit;

                const data = {
                    EmployeeID: employeeID,
                    ID_PayrollCycle: selectedPayrollCycleId,
                    InsuranceFee: insuranceFee,
                    TaxPayable: taxPayable,
                    Forfeit: forfeit,
                    PrizeMoney: prize,
                    TotalOTSalary: totalOTSalary,
                    NetSalary: netSalary,
                    PaymentDate: dayjs().format('YYYY-MM-DD'),
                };

                return post('/admin/monthlysalaries', data);
            }));

            fetchMonthlySalaries();
            message.success('Tính lương hàng loạt thành công!');
        } catch (error) {
            console.error(error);
            message.error('Đã xảy ra lỗi khi tính lương hàng loạt!');
        }
    };

    // Bảng tính thuế
    const calculateTax = (income) => {
        const taxBrackets = [...incomeTaxes].sort((a, b) => a.MinIncome - b.MinIncome);
        let tax = 0;

        for (let i = 0; i < taxBrackets.length; i++) {
            const current = taxBrackets[i];
            const prevMax = i === 0 ? 0 : taxBrackets[i - 1].MaxValue;
            const range = current.MaxValue - prevMax;

            if (income <= 0) break;

            const taxableAmount = i === taxBrackets.length - 1 ? income : Math.min(income, range);
            tax += taxableAmount * current.TaxRate;
            income -= taxableAmount;
        }

        return tax;
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();

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

            await put(`/admin/monthlysalaries/${values.ID_Salary}`, data);
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
                    await del(`/admin/monthlysalaries/${record.ID_Salary}`);
                    message.success(`Xóa thành công!`);
                    fetchMonthlySalaries();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handlePayrollCycleChange = (selectedPayrollCycleId) => {
        const employeeID = addForm.getFieldValue('EmployeeID');

        if (!employeeID) {
            message.warning("Vui lòng chọn nhân viên trước!");
            return;
        }

        const totalOT = overtimes
            .filter(ot => ot.ID_PayrollCycle === selectedPayrollCycleId && ot.EmployeeID === EmployeeID)
            .reduce((sum, ot) => sum + (ot.OverTimesHours || 0), 0);

        // Cập nhật lương OT vào form
        addForm.setFieldsValue({
            TotalOT: totalOT,
            TotalOTSalary: totalOT * 200000,
        });
    };

    const handleComplete = async () => {
        try {
            await put(`/admin/payrollcycles/${selectedPayrollCycleId}`, {
                Status: "Hoàn thành"
            });

            message.success('Cập nhật lương thành công!');
            handleEditCancel();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    <Select
                        placeholder="Chọn chu kỳ lương"
                        style={{ width: 170 }}
                        onChange={(value) => setSelectedPayrollCycleId(value)}
                    >
                        {filteredPayrolls.map(pay => (
                            <Select.Option key={pay.id} value={pay.id}>
                                {pay.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Typography.Title>

                <Flex align='center' gap='2rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    {role === 'accountant' && (
                        <Button type='primary' onClick={handleComplete} disabled={filteredEmployees.length > 0 || filteredMonthlySalaries.length === 0}>
                            <Space>Hoàn thành</Space>
                        </Button>
                    )}
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={columns}
                dataSource={filteredMonthlySalaries.map(emp => ({ ...emp, key: emp.ID_Salary }))}
                bordered
                size='midium'
                scroll={{
                    x: 'max-content',
                    y: 24.3 * 9,
                }}
                pagination={false}
                onChange={onChange}
            />

            <Flex justify='space-between' style={{ padding: '15px 20px 5px 20px' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', fontWeight: '100', fontSize: '1rem' }}>
                    Danh sách chưa tính lương ({filteredEmployees.length}/{jobprofiles.length})
                </Typography.Title>

                {role === 'accountant' && (
                    <Button type='primary' onClick={handleAddAll} disabled={filteredEmployees.length === 0}>
                        <Space>Tính lương tất cả</Space>
                    </Button>
                )}
            </Flex>

            <Table
                className='table_TQ'
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={columnEMPs}
                dataSource={filteredEmployees.map(emp => ({ ...emp, key: emp.EmployeeID }))}
                bordered
                size='midium'
                scroll={{
                    x: 'max-content',
                    y: 18.5 * 9,
                }}
                pagination={false}
                onChange={onChange}
            />

            {/* Tạo mới */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Bảng Lương</div>} open={isAddModalOpen} onOk={handleAddSave} onCancel={handleAddCancel} centered >
                <Form form={addForm} layout='vertical'>
                    <Form.Item label='Nhân viên' name='EmployeeID' rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
                        <Select placeholder="Chọn nhân viên">
                            {employees.map(emp => (
                                <Select.Option key={emp.EmployeeID} value={emp.EmployeeID}>
                                    {emp.FullName} ({emp.EmployeeID})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Chu kỳ lương' name='ID_PayrollCycle' rules={[{ required: true, message: 'Vui lòng chọn chu kỳ lương!' }]}>
                        <Select placeholder="Chọn chu kỳ lương">
                            {payrollcycles.filter(payroll => payroll.Status.toLowerCase() === 'đang xử lý')
                                .map(payroll => (
                                    <Select.Option key={payroll.ID_PayrollCycle} value={payroll.ID_PayrollCycle}>
                                        {payroll.PayrollName} ({payroll.ID_PayrollCycle})
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
                        <Input type='number' disabled />
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