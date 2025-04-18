import { Tabs } from 'antd';
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const PolicyInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey = location.pathname.includes('salary-policy')
    ? '1'
    : location.pathname.includes('benefit-policy')
    ? '2'
    : location.pathname.includes('hr-policy')
    ? '3'
    : location.pathname.includes('work-policy')
    ? '4'
    : '1'; // fallback mặc định nếu không khớp
  

    const handleChange = (key) => {
        if (key === '1') {
            navigate('/user/policyinfo/salary-policy');
        } else if (key === '2') {
            navigate('/user/policyinfo/benefit-policy');
        } else if (key === '3') {
            navigate('/user/policyinfo/hr-policy');
        } else if (key === '4') {
            navigate('/user/policyinfo/work-policy');
        }
    };

    return (
        <div className='ant-layout' style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{position: 'fixed', zIndex: 1000, width: '100%'}}>
            <Tabs
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={handleChange}
                items={[
                    { key: '1', label: 'CHÍNH SÁCH LƯƠNG' },
                    { key: '2', label: 'CHÍNH SÁCH PHÚC LỢI' },
                    { key: '3', label: 'CHÍNH SÁCH NHÂN SỰ' },
                    { key: '4', label: 'QUY ĐỊNH LÀM VIỆC' },
                ]}
            />
            </div>
            <div style={{ marginTop: '30px' }}>
                <Outlet /> 
            </div>
        </div>
    );
};

export default PolicyInfo;
