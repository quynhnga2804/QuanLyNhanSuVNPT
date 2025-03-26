import { Tabs } from 'antd';
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const GeneralInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey = location.pathname.includes('contract') ? '2' : '1';

    const handleChange = (key) => {
        if (key === '1') {
            navigate('/user/generalinfo/profile');
        } else if (key === '2') {
            navigate('/user/generalinfo/contracts');
        }
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Tabs
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={handleChange}
                items={[
                    { key: '1', label: 'THÔNG TIN NHÂN VIÊN' },
                    { key: '2', label: 'HỢP ĐỒNG' },
                ]}
            />
            <div style={{ marginTop: 0 }}>
                <Outlet /> {/* chỗ này render nội dung tab tương ứng */}
            </div>
        </div>
    );
};

export default GeneralInfo;
