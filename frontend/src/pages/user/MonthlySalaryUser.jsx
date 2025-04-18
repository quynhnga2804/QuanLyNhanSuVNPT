import { Table, Flex, message } from 'antd';
import axios from "axios";
import React, { useState, useEffect } from "react";

const MonthlySalaryUser = ({monthlySalaryUser}) => {
    const uniquePayroll = Array.from( new Map(monthlySalaryUser.map(s => [s.ID_PayrollCycle, { text: s.PayrollCycle?.PayrollName, value: s.ID_PayrollCycle }])).values());

    // Formatter cho tiền tệ
    const currencyFormatter = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
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
            title: 'KỲ LƯƠNG',
            dataIndex: 'PayrollCycle',
            width: 120,
            align: 'center',
            ellipsis: true,
            filters: uniquePayroll,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.ID_PayrollCycle === value,
            render: (payroll) => payroll?.PayrollName || '',
        },
        {
            title: 'LƯƠNG CƠ BẢN',
            dataIndex: 'BaseSalary',
            width: 130,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
        },
        {
            title: 'PHỤ CẤP',
            dataIndex: 'Allowance',
            width: 130,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
        },
        {
            title: 'BẢO HIỂM',
            dataIndex: 'InsuranceFee',
            width: 100,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
        },
        {
            title: 'THUẾ',
            dataIndex: 'TaxPayable',
            width: 100,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
        },
        {
            title: 'PHẠT',
            dataIndex: 'Forfeit',
            width: 100,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
            sorter: (a, b) => a.Forfeit - b.Forfeit,
        },
        {
            title: 'THƯỞNG',
            dataIndex: 'PrizeMoney',
            width: 100,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
            sorter: (a, b) => a.PrizeMoney - b.PrizeMoney,
        },
        {
            title: 'LƯƠNG OT',
            dataIndex: 'TotalOTSalary',
            width: 120,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
            sorter: (a, b) => a.TotalOTSalary - b.TotalOTSalary,
        },
        {
            title: 'THỰC LĨNH',
            dataIndex: 'NetSalary',
            width: 130,
            align: 'center',
            render: (value) => currencyFormatter.format(value || 0),
            sorter: (a, b) => a.NetSalary - b.NetSalary,
        },
        {
            title: 'NGÀY TÍNh LƯƠNG',
            dataIndex: 'PaymentDate',
            width: 130,
            align: 'center',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '',
            sorter: (a, b) => new Date(a.DateTime) - new Date(b.DateTime),
        },
    ];

    return (
        <Flex vertical style={{ width: '100%' }}>
            <Table
                className='table_TQ'
                columns={columns}
                dataSource={monthlySalaryUser}
                bordered
                size='medium'
                scroll={{
                    x: 1200,
                    y: 52.8 * 9,
                }}
                pagination={false}
                rowKey={(record) => record._id}
            />
        </Flex>
    );
};

export default MonthlySalaryUser;
