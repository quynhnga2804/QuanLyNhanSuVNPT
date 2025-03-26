import React, { useState, useEffect } from 'react';
import Search from 'antd/es/transfer/search';
import { Image, Divider, Card, Table, Progress, Flex, Typography, Space, Button, Col, Row } from 'antd';
import {
    FallOutlined,
    FolderOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { Title: AntTitle, Text } = Typography;

const PayrollCycle = ({ monthlysalaries, payrollcycles }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState('');

    // const filteredPayrollCycles = payrollcycles.filter(pay =>
    //     pay.PayRollName.toLowerCase().includes(searchQuery)
    //     && (statusFilter ? pay.status === statusFilter : true)
    // );

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

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
        },
        {
            title: 'NGÀY KẾT THÚC',
            dataIndex: 'EndDate',
            minWidth: 108,
            align: 'center',
            filterSearch: true,
        },
        {
            title: 'TỔNG CHI TIÊU',
            dataIndex: 'ID_PayrollCycle',
            minWidth: 64,
            align: 'right',
            // render: (id) => {
            //     const payrollcycle = payrollcycles.find(payr => payr.ID_PayrollCycle === id);
            //     return payrollcycle ? payrollcycle.PayrollName : '0';
            // },
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'Status',
            minWidth: 70,
            align: 'center',
            filterSearch: true,
            sorter: (a, b) => {
                const order = ['Đang xử lý', 'Chờ xử lý', 'Sắp diễn ra']; // Thứ tự ưu tiên
                return order.indexOf(a.Status) - order.indexOf(b.Status);
            },
            defaultSortOrder: 'ascend',
            render: (status) => {
                const statusColors = {
                    'Đang xử lý': 'green',
                    'Chờ xử lý': 'orange',
                    'Sắp diễn ra': 'blue',
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

    const fetchData = async () => {
        try {
            // Lọc ra các kỳ lương đã hoàn thành
            const completedPayrolls = payrollcycles.filter((p) => p.Status.includes('Đã hoàn thành'));

            // Tổng hợp dữ liệu theo tháng
            const salaryByMonth = {};

            completedPayrolls.forEach((payroll) => {
                const { ID_PayrollCycle, StartDate } = payroll;
                const monthYear = dayjs(StartDate).format('YYYY-MM');

                const totalSalary = monthlysalaries
                    .filter((s) => s.ID_PayrollCycle === ID_PayrollCycle)
                    .reduce((sum, s) => sum + parseFloat(s.NetSalary || 0), 0);

                salaryByMonth[monthYear] = (salaryByMonth[monthYear] || 0) + totalSalary;
            });

            // Chuyển đổi thành mảng để vẽ biểu đồ
            const labels = Object.keys(salaryByMonth).sort();
            const dataPoints = labels.map((monthYear) => salaryByMonth[monthYear]);

            setChartData((prev) => {
                if (
                    JSON.stringify(prev.labels) === JSON.stringify(labels) &&
                    JSON.stringify(prev.datasets[0]?.data) === JSON.stringify(dataPoints)
                ) {
                    return prev; // Không cập nhật nếu dữ liệu giống nhau
                }
                return {
                    labels,
                    datasets: [
                        {
                            label: "Tổng lương theo tháng",
                            data: dataPoints,
                            borderColor: "blue",
                            backgroundColor: "blue",
                            borderWidth: 2,
                            pointRadius: 5,
                            pointBackgroundColor: "blue",
                            tension: 0.4,
                        },
                    ],
                };
            });
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: true,
                intersect: false,
                displayColors: false,
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '99%' }}>
            <Row gutter={16}>
                <Col span={16}>
                    <Card>
                        <div style={{ height: '200px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <AntTitle level={4}>Payment Status</AntTitle>
                        <Text strong style={{ fontSize: 20 }}>2,400 Employees</Text>
                        <Progress percent={68} success={{ percent: 68 }} strokeColor='#52c41a' />
                        <Progress percent={17} success={{ percent: 17 }} strokeColor='#faad14' />
                        <Progress percent={15} strokeColor='#722ed1' />
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
                    y: 40 * 4,
                }}
                pagination={false}
                onChange={onChange}
            />
        </div>
    )
};

export default PayrollCycle;