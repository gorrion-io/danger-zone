import { ApolloProvider } from '@apollo/react-hooks';
import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { client } from './ApolloClient';
import { ReportList } from './modules/reportList/report-list.component';
import { RegisterForm } from './modules/registerForm/register-form.component';
import { MagicLinkForm } from './modules/magicLinkForm/magic-link-form.component';
import { MagicLinkHandler } from './modules/magicLinkHandler/magic-link-handler.component';
import { ActivateAccountHandler } from './modules/activateAccountHandler/activate-account-handler.component';
import { Navbar } from './modules/navbar/navbar.component';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Content>
          <Router>
            <Header>
              <Navbar />
            </Header>
            <Switch>
              <Route path='/login'>
                <MagicLinkForm />
              </Route>
              <Route path='/register'>
                <RegisterForm />
              </Route>
              <Route path='/link/:id'>
                <MagicLinkHandler />
              </Route>
              <Route path='/activateAccount/:id'>
                <ActivateAccountHandler />
              </Route>
              <Route path='/'>
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
