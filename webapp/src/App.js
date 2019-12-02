import { ApolloProvider } from '@apollo/react-hooks';
import { Layout } from 'antd';
import React from 'react';
import { client } from './ApolloClient';
import { LoginForm } from './modules/loginForm/login-form.component';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header>HEDER</Header>
        <Content>
          <LoginForm />
        </Content>
        <Footer>&copy; {new Date().getFullYear()} Danger Zone</Footer>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
