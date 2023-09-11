import React from 'react';
import { Layout, Space } from 'antd';

const { Header, Footer, Sider, Content } = Layout;


const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#5C8374',
  position: 'fixed',
  width: '100%',
  top: 0,
  zIndex: 100,
  borderBottom: '5px solid #93B1A6',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 1200,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
  width: 'box-sizing',
  zIndex: 20,
  borderRadius: 10,
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: 'black',
  backgroundColor: 'white',
  border: '3px solid #7dbcea',
  width: 'box-sizing',
  marginRight: 50,
  marginLeft: 50,
  borderRadius: 10,
  height: 500,
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
  position: 'static',
  bottom: 0,
  width: '100%',
};

const StudentPage: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Layout>
      <Header style={headerStyle}>Header</Header>
      <Layout hasSider style={{margin: 100}}>
        <Sider style={siderStyle}>Sider</Sider>
        <Content style={contentStyle}>
            <p>Content</p>

        </Content>
        <Sider style={siderStyle}>Sider</Sider>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  </Space>
);

export default StudentPage;