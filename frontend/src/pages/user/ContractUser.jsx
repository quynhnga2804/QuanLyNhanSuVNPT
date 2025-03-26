import React, { useState, useEffect } from 'react';
import { Layout, List, Typography, Spin, message } from 'antd';
import { Flex } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function ContractUser({contractUsers}) {
  // const [contractUsers, setContractUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem('token');

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             const contractResponse = await fetch("http://localhost:5000/api/user/contractinfo", {
  //                 headers: { Authorization: `Bearer ${token}` }
  //             });
  //             const contractData = await contractResponse.json();
  //             if (!contractResponse.ok) throw new Error(contractData.message);
  //             setContractUsers(contractData);
  //         } catch (error) {
  //             message.error(error.message);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     fetchData();
  // }, []);

  return (
    <Layout className="home-container">
      <Content style={{ padding: '20px' }}>
        <Flex vertical align="center" style={{padding: '20px', background: '#f0f2f5' }}>
          <Flex vertical  style={{ width: '100%', background: '#ffffff',  padding: '20px',borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', }}  >
            <Title level={3} style={{ marginBottom: '0px' }}>
              Danh sách hợp đồng
            </Title>
            <hr />
            {/* {loading ? (
              <Spin tip="Đang tải danh sách hợp đồng..." size="large" />
            ) : ( */}
              <List
                itemLayout="vertical"
                dataSource={contractUsers}
                renderItem={(contract) => (
                  <List.Item key={contract.ID_Contract} style={{ marginBottom: '12px', background: '#e6f7ff', padding: '12px', borderRadius: '6px' }}>
                    <Paragraph><strong>Loại hợp đồng:</strong> {contract.LaborContract ? contract.LaborContract.ContractType : "Chưa có phòng ban"}</Paragraph>
                    <div style={{justifyContent:'space-between', display: 'flex', width:'50%'}}>
                      <Paragraph><strong>Ngày bắt đầu:</strong> {new Date(contract.StartDate).toLocaleDateString()}</Paragraph>
                      <Paragraph><strong>Ngày kết thúc:</strong> {contract.EndDate ? new Date(contract.EndDate).toLocaleDateString() : 'Chưa có'}</Paragraph>
                    </div>
                    <Paragraph><strong>Trạng thái:</strong> {contract.Status}</Paragraph>
                  </List.Item>
                )}
              />
            {/* )} */}
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default ContractUser;
