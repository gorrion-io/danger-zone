import { ApolloProvider } from '@apollo/react-hooks';
import { Layout } from 'antd';
import React from 'react';
import { client } from './ApolloClient';
import { LoginRegistrationPage } from './modules/loginRegistrationPage/login-registration-page.component';
import { ReportList } from './modules/reportList/report-list.component';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header>HEDER</Header>
        <Content>
          <LoginRegistrationPage />
          <ReportList />
        </Content>
        <Footer>&copy; {new Date().getFullYear()} Danger Zone</Footer>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
