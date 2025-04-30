import { Table, Button, Flex, InputNumber, Space, Typography, Modal, Form, Input, message, Dropdown } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { get, put, post, del } from '../../api/apiService';

const Tax_Insurance = () => {
    const token = localStorage.getItem('token');
    const [taxes, setTaxes] = useState([]);
    const [insurances, setInsurances] = useState([]);
    const [isAddTaxModalOpen, setIsAddTaxModalOpen] = useState(false);
    const [isEditTaxModalOpen, setIsEditTaxModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);
    const [editTaxForm] = Form.useForm();
    const [addTaxForm] = Form.useForm();
    const [isAddInsModalOpen, setIsAddInsModalOpen] = useState(false);
    const [isEditInsModalOpen, setIsEditInsModalOpen] = useState(false);
    const [editingIns, setEditingIns] = useState(null);
    const [editInsForm] = Form.useForm();
    const [addInsForm] = Form.useForm();
    const today = dayjs().format('YYYY-MM-DD');

    useEffect(() => {
        if (token) {
            fetchTaxes(token);
            fetchInsurances(token);
        }
    }, [token]);

    const fetchTaxes = async () => {
        try {
            const response = await get('/admin/incometaxes');
            const sortedData = response.data.sort((a, b) => {
                const aVal = a.MaxValue === null ? Infinity : Number(a.MaxValue);
                const bVal = b.MaxValue === null ? Infinity : Number(b.MaxValue);
                return aVal - bVal;
            });
            setTaxes(sortedData);
        } catch (error) {
            console.error('Lỗi khi lấy bảng thuế:', error);
        }
    };

    const fetchInsurances = async () => {
        try {
            const response = await get('admin/insurances');
            setInsurances(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy bảng bảo hiểm:', error);
        }
    };

    const handleEditTax = (record) => {
        setEditingTax(record);
        editTaxForm.setFieldsValue(record);
        setIsEditTaxModalOpen(true);
    };

    const handleEditTaxCancel = () => {
        setIsEditTaxModalOpen(false);
        editTaxForm.resetFields();
    };

    const handleEditTaxSave = async () => {
        try {
            const values = await editTaxForm.validateFields();
            values.ChangeDate = today;
            if (!isValidInsert(values.MaxValue, values.TaxRate, editingTax.ID)) return;
            await put(`/admin/incometaxes/${editingTax.ID}`, values);
            fetchTaxes();
            message.success('Chỉnh sửa thuế thành công!');
            handleEditTaxCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleEditIns = (record) => {
        setEditingIns(record);
        editInsForm.setFieldsValue(record);
        setIsEditInsModalOpen(true);
    };

    const handleEditInsCancel = () => {
        setIsEditInsModalOpen(false);
        editInsForm.resetFields();
    };

    const handleEditInsSave = async () => {
        try {
            const values = await editInsForm.validateFields();
            values.ChangeDate = today;
            await put(`/admin/insurances/${editingIns.InsuranceType}`, values);
            fetchInsurances();
            message.success('Chỉnh sửa bảo hiểm thành công!');
            handleEditInsCancel();
        } catch (error) {
            message.error('Sửa thất bại, vui lòng thử lại.');
        }
    };

    const handleAddNewTax = () => {
        setIsAddTaxModalOpen(true);
    };

    const handleAddTaxCancel = () => {
        setIsAddTaxModalOpen(false);
        addTaxForm.resetFields();
    };

    const handleAddTaxSave = async () => {
        try {
            const values = await addTaxForm.validateFields();
            values.ChangeDate = today;
            if (!isValidInsert(values.MaxValue, values.TaxRate)) return;
            await post('/admin/incometaxes', values);
            fetchTaxes();
            message.success('Thêm mới thuế thành công!');
            handleAddTaxCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const handleAddNewIns = () => {
        setIsAddInsModalOpen(true);
    };

    const handleAddInsCancel = () => {
        setIsAddInsModalOpen(false);
        addInsForm.resetFields();
    };

    const handleAddInsSave = async () => {
        try {
            const values = await addInsForm.validateFields();
            values.ChangeDate = today;
            await post('/admin/insurances', values);
            fetchInsurances();
            message.success('Thêm mới bảo hiểm thành công!');
            handleAddInsCancel();
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng kiểm tra lại!');
        }
    };

    const isValidInsert = (newValue, newRate, id = null) => {
        const sortedTaxes = taxes.filter(tax => tax.ID !== id);

        const hasNull = sortedTaxes.some(t => t.MaxValue === null);
        if (newValue == null && hasNull) {
            message.warning('Đã tồn tại một khoảng vô cực.');
            return false;
        }

        // Thêm giá trị mới là null → kiểm tra cuối
        if (newValue == null) {
            const last = sortedTaxes[sortedTaxes.length - 1];
            const lastRate = parseFloat(last?.TaxRate ?? 0);
            if (newRate > lastRate) return true;
            else {
                message.error(`Thuế suất mới (${newRate}%) phải lớn hơn thuế suất cuối cùng (${lastRate}%)!`);
                return false;
            }
        }

        for (let i = 0; i <= sortedTaxes.length; i++) {
            const prev = sortedTaxes[i - 1];
            const next = sortedTaxes[i];

            const prevMax = prev?.MaxValue === null ? Infinity : Number(prev?.MaxValue ?? 0);
            const nextMax = next?.MaxValue === null ? Infinity : Number(next?.MaxValue ?? Infinity);

            if (newValue > prevMax && newValue < nextMax) {
                const prevRate = parseFloat(prev?.TaxRate ?? 0);
                const nextRate = parseFloat(next?.TaxRate ?? 100);

                if (newRate > prevRate && newRate < nextRate) return true;
                else {
                    message.error(`Thuế suất mới (${newRate}%) phải nằm giữa ${prevRate}% và ${nextRate}%!`);
                    return false;
                }
            }
        }

        message.error(`Giá trị ${newValue} không nằm trong bất kỳ khoảng hợp lệ nào!`);
        return false;
    };

    const handleDeleteTax = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/incometaxes/${record.ID}`);
                    message.success(`Xóa dữ liệu thuế thành công!`);
                    fetchTaxes();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const handleDeleteIns = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await del(`/admin/insurances/${record.InsuranceType}`);
                    message.success(`Xóa dữ liệu bảo hiểm thành công!`);
                    fetchInsurances();
                } catch (error) {
                    message.error('Xóa thất bại, vui lòng thử lại.');
                }
            },
        });
    };

    const columnTaxs = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'THU NHẬP ÁP DỤNG TỐI ĐA (VNĐ)',
            dataIndex: 'MaxValue',
            align: 'right',
            render: (value, i) => value ? new Intl.NumberFormat('vi-VN').format(value) : 'Còn lại',
        },
        {
            title: 'THUẾ SUẤT',
            dataIndex: 'TaxRate',
            align: 'center',
            render: (value) => `${(value * 100).toFixed(0)}%`,
        },
        {
            title: 'NGÀY CẬP NHẬT',
            dataIndex: 'ChangeDate',
            align: 'center',
            sorter: (a, b) => new Date(a.ChangeDate) - new Date(b.ChangeDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            align: 'center',
            minWidth: 90,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEditTax(record)} style={{ border: 'none', height: '20px', width: '45px' }}>Sửa</Button>
                    <Button type="link" danger onClick={() => handleDeleteTax(record)} style={{ border: 'none', height: '20px', width: '45px' }}>Xóa</Button>
                </>
            ),
        }
    ];

    const columnInsurances = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'LOẠI BẢO HIỂM',
            dataIndex: 'InsuranceType',
            align: 'center',
            with: 40,
        },
        {
            title: 'NGƯỜI LAO ĐỘNG',
            dataIndex: 'Employee',
            align: 'center',
            with: 60,
            render: (value) => `${(value * 100).toFixed(0)}%`,
        },
        {
            title: 'NGƯỜI SỬ DỤNG LAO ĐỘNG',
            dataIndex: 'Employer',
            align: 'center',
            minWidth: 110,
            render: (value) => `${(value * 100).toFixed(0)}%`,
        },
        {
            title: 'NGÀY CẬP NHẬT',
            dataIndex: 'ChangeDate',
            align: 'center',
            with: 40,
            sorter: (a, b) => new Date(a.ChangeDate) - new Date(b.ChangeDate),
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
        },
        {
            title: 'CHỨC NĂNG',
            dataIndex: 'actions',
            align: 'center',
            maxWidth: 40,
            fixed: 'right',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEditIns(record)} style={{ border: 'none', height: '20px', width: '45px' }}>Sửa</Button>
                    <Button type="link" danger onClick={() => handleDeleteIns(record)} style={{ border: 'none', height: '20px', width: '45px' }}>Xóa</Button>
                </>
            ),
        }
    ];

    return (
        <div style={{ maxWidth: '100%', overflowX: 'auto', backgroundColor: '#fff' }}>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                </Typography.Title>

                <Flex align='center' gap='2rem'>
                    <Dropdown menu={{
                        items: [
                            { key: 'tax', label: 'Thuế', onClick: () => handleAddNewTax(), },
                            { key: 'ins', label: 'Bảo hiểm', onClick: () => handleAddNewIns(), },
                        ],
                    }}>
                        <Button type='primary'>
                            <Space>
                                Tạo mới <PlusOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Flex>
            </Flex>

            <Flex justify='space-between' style={{ padding: '5px 20px 0 20px' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', fontWeight: '500', fontSize: '1rem' }}>
                    CHÍNH SÁCH TÍNH THUẾ
                </Typography.Title>
            </Flex>

            <Table
                className='table_TQ'
                columns={columnTaxs}
                dataSource={taxes.map(dvs => ({ ...dvs, key: dvs.ID }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
            />

            <Flex justify='space-between' style={{ padding: '15px 20px 0 20px' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', fontWeight: '500', fontSize: '1rem' }}>
                    CHÍNH SÁCH TÍNH BẢO HIỂM
                </Typography.Title>
            </Flex>

            <Table
                className='table_TQ'
                columns={columnInsurances}
                dataSource={insurances.map(dvs => ({ ...dvs, key: dvs.InsuranceType }))}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 52.8 * 9,
                }}
                pagination={false}
            />

            {/* Thêm mới thuế */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Mức Thuế</div>} open={isAddTaxModalOpen} onOk={handleAddTaxSave} onCancel={handleAddTaxCancel} centered>
                <Form form={addTaxForm} layout='vertical'>
                    <Form.Item label='Thu nhập áp dụng tối đa' name='MaxValue'>
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item label='Thuế suất' name='TaxRate' rules={[{ required: true }]}>
                        <Input type='number' />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Thêm mới bảo hiểm */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Thêm Mới Mức Bảo Hiểm</div>} open={isAddInsModalOpen} onOk={handleAddInsSave} onCancel={handleAddInsCancel} centered>
                <Form form={addInsForm} layout='vertical'>
                    <Form.Item label='Loại bảo hiểm' name='InsuranceType' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Người lao động' name='Employee' rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label='Người sử dụng lao động' name='Employer' rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa thuế */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Mức Thuế</div>} open={isEditTaxModalOpen} onOk={handleEditTaxSave} onCancel={handleEditTaxCancel} centered >
                <Form form={editTaxForm} layout='vertical'>
                    <Form.Item label='Thu nhập áp dụng tối đa' name='MaxValue'>
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item label='Thuế suất' name='TaxRate' rules={[{ required: true }]}>
                        <Input type='number' />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Chỉnh sửa thuế */}
            <Modal className='editfrm' title={<div style={{ textAlign: 'center', width: '100%' }}>Chỉnh Sửa Bảo Hiểm</div>} open={isEditInsModalOpen} onOk={handleEditInsSave} onCancel={handleEditInsCancel} centered >
                <Form form={editInsForm} layout='vertical'>
                    <Form.Item label='Loại bảo hiểm' name='InsuranceType' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Người lao động' name='Employee' rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                    </Form.Item>
                    <Form.Item label='Người sử dụng lao động' name='Employer' rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Tax_Insurance