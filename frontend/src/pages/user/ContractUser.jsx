import React from 'react';
import { Layout, List, Typography } from 'antd';
import { Flex } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

function ContractUser({contractUsers}) {

  return (
    <Layout className="home-container">
      <Content style={{ padding: '20px' }}>
        <Flex vertical align="center" style={{padding: '20px'}}>
          <Flex vertical  style={{ width: '100%', background: '#ffffff',  padding: '20px',borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', }}  >
            <Title level={3} style={{ marginBottom: '0px' }}>
              Danh sách hợp đồng
            </Title>
            <hr />
            {
              contractUsers.length === 0 ? (
                <Text className="none-info">Chưa có dữ liệu hợp đồng!</Text>
              ) : (
              <List
                itemLayout="vertical"
                dataSource={contractUsers}
                renderItem={(contract) => {
                  const today = new Date();
                  const endDate = contract.EndDate ? new Date(contract.EndDate) : null;
                  const isExpired = endDate && endDate < today;
                  const statusContract = isExpired ? "Đã hết hạn" : "Hoạt động";
                  const statusColor = isExpired ? 'red' : '#339933';
                  return (
                  <List.Item key={contract.ID_Contract} style={{ marginBottom: '12px', background: 'rgb(246, 247, 255)', padding: '12px', borderRadius: '6px' }}>
                    <Paragraph><strong>Loại hợp đồng:</strong> {contract.LaborContract ? contract.LaborContract.ContractType : "Chưa có phòng ban"}</Paragraph>
                    <div style={{justifyContent:'space-between', display: 'flex', width:'50%'}}>
                      <Paragraph><strong>Ngày bắt đầu:</strong> {new Date(contract.StartDate).toLocaleDateString()}</Paragraph>
                      <Paragraph><strong>Ngày kết thúc:</strong> {contract.EndDate ? new Date(contract.EndDate).toLocaleDateString() : 'Chưa có'}</Paragraph>
                    </div>
                    
                    <Paragraph><strong>Trạng thái:</strong><span style={{color: statusColor, fontWeight: 'bold'}}> {statusContract}</span></Paragraph>
                  </List.Item>
                  );
                }}
              />
              )}
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default ContractUser;
