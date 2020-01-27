import { ApolloProvider } from '@apollo/react-hooks';
import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { client } from './ApolloClient';
import { ReportList } from './modules/reportList/report-list.component';
import { AddUserForm } from './modules/addUserForm/add-user-form.component';
import { RegisterForm } from './modules/registerForm/register-form.component';
import { LoginForm } from './modules/loginForm/login-form.component';
import { MagicLinkHandler } from './modules/magicLinkHandler/magic-link-handler.component';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Content>
          <Router>
            <Header>HEDER</Header>
            <Switch>
              <Route path='/login'>
                <LoginForm />
              </Route>
              <Route path='/register'>
                <RegisterForm />
              </Route>
              <Route path='/link/:id'>
                <MagicLinkHandler />
              </Route>
              <Route path='/'>
                <AddUserForm />
                <ReportList />
              </Route>
            </Switch>
          </Router>
        </Content>
        <Footer>&copy; {new Date().getFullYear()} Danger Zone</Footer>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
