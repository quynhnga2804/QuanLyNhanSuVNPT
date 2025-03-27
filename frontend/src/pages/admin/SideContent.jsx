import { Card, Flex, Menu } from 'antd'
import React from 'react'

const SideContent = ({ nowContracts, expiringContracts }) => {
    return (
        <Flex vertical gap='1rem' style={{ width: '30%', padding: '10px' }}>
            <Card style={{ fontSize: 12 }}>
                <table>
                    <tr>
                        <td>
                            <h1 style={{ textAlign: 'center', color: 'green' }}>{nowContracts.length}</h1>
                            HỢP ĐỒNG HIỆN TẠI
                        </td>
                        <td style={{ padding: '0 15px' }}></td>
                        <td>
                            <h1 style={{ textAlign: 'center', color: 'orange' }}>{expiringContracts.length}</h1>
                            SẮP HẾT HẠN
                        </td>
                    </tr>
                </table>
            </Card>
        </Flex>
    )
}

export default SideContent