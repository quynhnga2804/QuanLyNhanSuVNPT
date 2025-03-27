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
        <div className='ant-layout' style={{ width: '100%'}}>
            <div style={{position: 'fixed', zIndex: 1000}}>
            <Tabs
                style={{position: 'fixed', width: '100%'}}
                className='menu-horizontal'
                activeKey={activeKey}
                onChange={handleChange}
                items={[
                    { key: '1', label: 'THÔNG TIN NHÂN VIÊN' },
                    { key: '2', label: 'HỢP ĐỒNG' },
                ]}
            />
            </div>
            <div style={{ marginTop: '4rem' }}>
                <Outlet /> 
            </div>
            
        </div>
    );
};

export default GeneralInfo;
