import { Table } from 'antd'
import React, { useState } from 'react'

const columns = [
  {
    title: 'NHÂN SỰ',
    dataIndex: 'name',
    fixed: 'left',
    filters: [
      {
        text: 'Phạm Thị Quỳnh Nga',
        value: 'Phạm Thị Quỳnh Nga',
      },
      {
        text: 'Họ tên',
        value: 'Họ tên',
      }
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value),
  },
  {
    title: 'MÃ',
    dataIndex: 'id',
    fixed: 'left',
    filters: [
      {
        text: 'NV08367232',
        value: 'NV08367232',
      },
      {
        text: 'Mã nhân sự',
        value: 'Mã nhân sự',
      }
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.id.includes(value),
  },
  {
    title: 'TÀI KHOẢN',
    dataIndex: 'account',
    minWidth: 89,
    align: 'right',
  },
  {
    title: 'TRẠNG THÁI',
    dataIndex: 'status',
    minWidth: 95,
    filters: [
      {
        text: 'Đang làm việc',
        value: 'Đang làm việc',
      },
      {
        text: 'Đã nghỉ việc',
        value: 'Đã nghỉ việc',
      }
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.status.includes(value),
  },
  {
    title: 'CHÍNH SÁCH',
    dataIndex: 'policy',
  },
  {
    title: 'MÃ SỐ THUẾ',
    dataIndex: 'vat',
    minWidth: 145,
  },
  {
    title: 'CĂN CƯỚC',
    dataIndex: 'identity',
    minWidth: 144,
  },
  {
    title: 'GIẢM TRỪ THUẾ',
    dataIndex: 'taxDeductions',
    minWidth: 83,
    align: 'right',
  },
  {
    title: 'NGÀY CÔNG',
    dataIndex: 'workDay',
    minWidth: 95,
    align: 'right',
  },
  {
    title: 'LƯƠNG THÁNG',
    dataIndex: 'salaryMonth',
    minWidth: 112,
    align: 'right',
  },
  {
    title: 'TIỀN CƠM TRƯA',
    dataIndex: 'lunchAllowance',
    minWidth: 119,
    align: 'right',
  },
  {
    title: 'TIỀN ĐIỆN THOẠI',
    dataIndex: 'phoneAllowance',
    minWidth: 120,
    align: 'right',
  },
  {
    title: 'TIỀN XĂNG XE',
    dataIndex: 'fuelAllowance',
    minWidth: 105,
    align: 'right',
  },
  {
    title: 'TIỀN PHỤ CẤP KHÁC',
    dataIndex: 'otherAllowance',
    minWidth: 142,
    align: 'right',
  },
  {
    title: 'LƯƠNG OT',
    dataIndex: 'otSalary',
    minWidth: 88,
    align: 'right',
  },
  {
    title: 'THỰC LÃNH',
    dataIndex: 'actualSalary',
    fixed: 'right',
    minWidth: 92,
    align: 'right',
  },
  {
    title: 'GHI CHÚ',
    dataIndex: 'note',
    fixed: 'right',
    minWidth: 73,
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const dataSource = new Array(46).fill(null).map((_, i) => ({
  key: i,
  name: 'Phạm Thị Quỳnh Nga',
  id: 'NV08367232',
  account: 'ngaptq',
  status: 'Đang làm việc',
  position: 'Nhân viên',
  classification: 'Nhân viên chính thức',
  salaryPolicy: 'Lương cố định',
  annualLeave: 12,
  workDay: 20,
  salaryMonth: (5000000).toLocaleString('vi-VN'),
  lunchAllowance: (10000).toLocaleString('vi-VN'),
  phoneAllowance: (50000).toLocaleString('vi-VN'),
  fuelAllowance: (100000).toLocaleString('vi-VN'),
  otherAllowance: (200000).toLocaleString('vi-VN'),
  otSalary: (100000).toLocaleString('vi-VN'),
  actualSalary: (5000000 + 10000 + 50000 + 100000 + 200000 + 100000).toLocaleString('vi-VN'),
  note: '',
}));

const DependentList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <>
      <Table
        className='table_TQ'
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        bordered
        size='midium'
        scroll={{
          x: 'max-content',
          y: 52.5 * 10,
        }}
        pagination={false}
        onChange={onChange}
      />
    </>
  )
}

export default DependentList