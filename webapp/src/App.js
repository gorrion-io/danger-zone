import { ApolloProvider } from '@apollo/react-hooks';
import { Layout } from 'antd';
import React from 'react';
import { client } from './ApolloClient';
import { LoginForm } from './modules/loginForm/login-form.component';
import { ReportList } from './modules/reportList/report-list.component';
import { AddReportForm } from './modules/addReport/add-report-form.component';
import { MapContainer } from './modules/map/map.component';
import styled from 'styled-components';

const { Header, Content, Footer } = Layout;
const ReportsContainer = styled.div`
  padding: 16px 30px;
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header>HEDER</Header>
        <Content>
          <LoginForm />
          <ReportsContainer>
          <MapContainer />
          <AddReportForm />
          <ReportList />
          </ReportsContainer>
        </Content>
        <Footer>&copy; {new Date().getFullYear()} Danger Zone</Footer>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
