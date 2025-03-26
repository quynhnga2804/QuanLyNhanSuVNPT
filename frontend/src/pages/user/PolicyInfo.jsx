import { Tabs } from 'antd';
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const PolicyInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey = location.pathname.includes('contract') ? '2' : '1';

    const handleChange = (key) => {
        if (key === '1') {
            navigate('/user/policyinfo/salary-policy');
        } else if (key === '2') {
            navigate('/user/policyinfo/benifit-policy');
        } else if (key === '3') {
            navigate('/user/policyinfo/hr-policy');
        }
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Tabs
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={handleChange}
                items={[
                    { key: '1', label: 'CHÍNH SÁCH LƯƠNG' },
                    { key: '2', label: 'CHÍNH SÁCH PHÚC LỢI' },
                    { key: '3', label: 'CHÍNH SÁCH NHÂN SỰ' },
                ]}
            />
            <div style={{ marginTop: 0 }}>
                <Outlet /> {/* chỗ này render nội dung tab tương ứng */}
            </div>
        </div>
    );
};

export default PolicyInfo;
