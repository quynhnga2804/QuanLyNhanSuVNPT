import React, { useState, useEffect, useMemo } from 'react';
import { Divider, Card, Table, Progress, Typography, Col, Row, Empty, Flex } from 'antd';
import dayjs from 'dayjs';
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

const { Title: AntTitle, Text } = Typography;
const PayrollCycle = ({ monthlysalaries, payrollcycles, departments, employees }) => {
    const columns = [
        {
            title: 'MÃ',
            dataIndex: 'ID_PayrollCycle',
            fixed: 'left',
            align: 'center',
        },
        {
            title: 'CHU KỲ',
            dataIndex: 'PayrollName',
            align: 'center',
            filterSearch: true,
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            minWidth: 64,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'NGÀY KẾT THÚC',
            dataIndex: 'EndDate',
            minWidth: 108,
            align: 'center',
            filterSearch: true,
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'TỔNG CHI TIÊU',
            dataIndex: 'ID_PayrollCycle',
            minWidth: 64,
            align: 'right',
            render: (id) => {
                const totalSalary = monthlysalaries.filter(mon => mon.ID_PayrollCycle === id)
                    .reduce((sum, mon) => sum + parseFloat(mon.NetSalary.toString().replace(/[^0-9.-]+/g, '')), 0);
                return new Intl.NumberFormat('vi-VN').format(totalSalary);
            },
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            minWidth: 70,
            align: 'center',
            filterSearch: true,
            sorter: (a, b) => {
                const order = ['Đang xử lý', 'Chờ xét duyệt', 'Chưa bắt đầu']; // Thứ tự ưu tiên
                return order.indexOf(a.Status) - order.indexOf(b.Status);
            },
            defaultSortOrder: 'ascend',
            render: (status) => {
                const statusColors = {
                    'Đang xử lý': 'green',
                    'Chờ xét duyệt': 'orange',
                    'Chưa bắt đầu': 'red',
                };

                return <span style={{ color: statusColors[status] || 'black' }}>{status.toUpperCase()}</span>;
            }
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (!payrollcycles || !monthlysalaries) return;
        fetchData();
    }, [payrollcycles, monthlysalaries]);

    // const fetchData = async () => {
    //     try {
    //         const completedPayrolls = payrollcycles.filter((p) => p.Status.includes('Hoàn thành'));
    //         const salaryByMonth = {};

    //         completedPayrolls.forEach((payroll) => {
    //             const { ID_PayrollCycle, StartDate } = payroll;
    //             const monthYear = dayjs(StartDate).format('MM-YYYY');

    //             const totalSalary = monthlysalaries
    //                 .filter((s) => s.ID_PayrollCycle === ID_PayrollCycle)
    //                 .reduce((sum, s) => sum + parseFloat(s.NetSalary || 0), 0);

    //             salaryByMonth[monthYear] = (salaryByMonth[monthYear] || 0) + totalSalary;
    //         });

    //         // Chuyển thành mảng chartData đúng yêu cầu
    //         const chartData = Object.keys(salaryByMonth)
    //             .map((monthYear) => ({
    //                 month: monthYear,
    //                 totalSalary: salaryByMonth[monthYear],
    //             }))
    //             .sort((a, b) => dayjs(a.month, 'MM-YYYY') - dayjs(b.month, 'MM-YYYY')); // sort theo tháng tăng dần

    //         setChartData(chartData); // nhớ set vào state nếu dùng React
    //     } catch (error) {
    //         console.error('Lỗi khi lấy dữ liệu:', error);
    //     }
    // };

    const fetchData = async () => {
        try {
            if (!payrollcycles || !monthlysalaries || !employees || !departments) return;

            const completedPayrolls = payrollcycles.filter((p) => p.Status.includes('Hoàn thành'));
            const salaryByMonth = {};         // Tổng lương tất cả
            const salaryByDepartment = {};    // Tổng lương từng phòng

            const departmentMap = Object.fromEntries(
                departments.map(dept => [dept.DepartmentID, dept.DepartmentName])
            );

            const payrollCycleMap = Object.fromEntries(
                completedPayrolls.map(p => [p.ID_PayrollCycle, dayjs(p.StartDate).format('MM-YYYY')])
            );

            completedPayrolls.forEach((payroll) => {
                const { ID_PayrollCycle, StartDate } = payroll;
                const monthYear = dayjs(StartDate).format('MM-YYYY');

                const salaries = monthlysalaries.filter((s) => s.ID_PayrollCycle === ID_PayrollCycle);

                let totalSalaryForMonth = 0;

                salaries.forEach((s) => {
                    const employee = employees.find((emp) => emp.EmployeeID === s.EmployeeID);
                    if (!employee) return;

                    const departmentID = employee.DepartmentID;
                    const departmentName = departmentMap[departmentID] || `Phòng ${departmentID}`;

                    const netSalary = parseFloat(s.NetSalary || 0);
                    totalSalaryForMonth += netSalary;

                    if (!salaryByDepartment[monthYear]) salaryByDepartment[monthYear] = {};
                    salaryByDepartment[monthYear][departmentName] = (salaryByDepartment[monthYear][departmentName] || 0) + netSalary;
                });

                salaryByMonth[monthYear] = (salaryByMonth[monthYear] || 0) + totalSalaryForMonth;
            });

            // Tạo dữ liệu cuối cùng
            const chartData = Object.keys(salaryByMonth)
                .map((monthYear) => ({
                    month: monthYear,
                    totalSalary: salaryByMonth[monthYear],
                    ...(salaryByDepartment[monthYear] || {}),
                }))
                .sort((a, b) => dayjs(a.month, 'MM-YYYY') - dayjs(b.month, 'MM-YYYY')); // sort theo tháng tăng dần

            setChartData(chartData);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const departmentPercentages = useMemo(() => {
        if (!chartData || chartData.length === 0) return [];

        const lastMonthData = chartData[chartData.length - 1]; // Lấy dữ liệu tháng mới nhất
        if (!lastMonthData) return [];
        const { totalSalary, month, ...departments } = lastMonthData;

        if (!totalSalary) return [];

        return Object.entries(departments)
            .filter(([key]) => key !== 'month' && key !== 'totalSalary') // Loại bỏ các key không cần
            .map(([departmentName, salary]) => ({
                departmentName,
                percent: (salary / totalSalary) * 100,
                salary,
            }))
            .sort((a, b) => b.percent - a.percent); // Sắp xếp phòng ban theo phần trăm giảm dần
    }, [chartData]);

    const colors = ['#52c41a', '#faad14', '#722ed1', '#13c2c2', '#eb2f96', '#2f54eb'];

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={14}>
                    <Card style={{ flex: 1, fontSize: '12px' }} bodyStyle={{ padding: '12px 22px' }}>
                        <AntTitle level={5}>Tổng lương theo tháng</AntTitle>
                        {chartData ? <ResponsiveContainer width='100%' height={250}>
                            <AreaChart data={chartData} margin={{ top: 30, right: 15, left: 15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id='colorSalary' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='0%' stopColor='#6A5ACD' stopOpacity={0.6} />
                                        <stop offset='100%' stopColor='#6A5ACD' stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='2 2' />
                                <XAxis dataKey='month' />
                                <YAxis allowDecimals={false} label={{ value: '(VNĐ)', angle: 0, position: 'top', offset: 15, style: { textAnchor: 'start' } }} tickFormatter={(value) => value.toLocaleString('vi-VN')} />
                                <Tooltip formatter={(value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
                                <Legend />
                                <Area type='monotone' dataKey='totalSalary' stroke='#6A5ACD' fill='url(#colorSalary)' fillOpacity={1} name='Tổng lương' />
                            </AreaChart>
                        </ResponsiveContainer> :
                            <Empty />
                        }
                    </Card>
                </Col>

                <Col span={10}>
                    <Card style={{ flex: 1 }} bodyStyle={{ padding: '12px 22px', minHeight: 305 }}>
                        <AntTitle level={5}>Tỉ trọng chi phí lương theo phòng ban</AntTitle>

                        {departmentPercentages ? departmentPercentages.map((dept, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: 22 }}>
                                <Flex vertical gap='small'>
                                    {/* <Tooltip title={`${parseFloat(dept.percent.toFixed(2))}%`}> */}
                                    <Progress percent={parseFloat(dept.percent.toFixed(2))} size={[435, 12]} strokeColor={colors[index % colors.length]} style={{ fontSize: '12px' }} />
                                    {/* </Tooltip> */}
                                </Flex>
                            </div>
                        )) :
                            <Empty />
                        }
                    </Card>
                </Col>
            </Row>

            <Divider orientation='left' plain style={{ fontSize: 11, color: 'gray', marginTop: '21px' }}>
                <b>DANH SÁCH CHU KỲ LƯƠNG</b>
            </Divider>

            <Table
                className='table_CK'
                columns={columns}
                dataSource={payrollcycles.map(pay => ({ ...pay, key: pay.ID_PayrollCycle }))}
                scroll={{
                    x: 'max-content',
                    y: 35 * 3,
                }}
                pagination={false}
                onChange={onChange}
            />
        </div>
    )
};

export default PayrollCycle;