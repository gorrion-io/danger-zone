import { ApolloProvider } from '@apollo/react-hooks';
import { Layout } from 'antd';
import React from 'react';
import { client } from './ApolloClient';
import { ReportList } from './modules/reportList/report-list.component';
import { AddUserForm } from './modules/addUserForm/add-user-form.component';
import { RegisterForm } from './modules/registerForm/register-form.component';
import { LoginForm } from './modules/loginForm/login-form.component';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header>HEDER</Header>
        <Content>
          <AddUserForm />
          <LoginForm />
          <RegisterForm />
          <ReportList />
        </Content>
        <Footer>&copy; {new Date().getFullYear()} Danger Zone</Footer>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
