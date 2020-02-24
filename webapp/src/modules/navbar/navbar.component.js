import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { AuthContext } from '../../contexts/auth.context';
import { useHistory } from 'react-router-dom';
import { LoginModal } from '../loginModal/login-modal.component';

const HeaderContainer = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
`;

const LogInfoContainer = HeaderContainer;

const UserName = styled.div`
  font-weight: 500;
  font-size: 18px;
  margin-right: 10px;
  color: white;
`;

const LoginButton = styled(Button)`
  margin-left: 8px !important;
`;

const RegisterButton = LoginButton;

export const Navbar = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userName = authContext.isAuth ? authContext.payload.userName : '';
    setUserName(userName);
  }, [authContext]);

  const onLogout = useCallback(() => {
    authContext.logout();
  }, []);

  return (
    <HeaderContainer>
      {userName ? (
        <LogInfoContainer>
          <UserName>Hello {userName}</UserName>
          <Button onClick={onLogout}>Logout</Button>
          <RegisterButton onClick={() => history.push('/register')}>Register</RegisterButton>
        </LogInfoContainer>
      ) : (
        <LoginModal />
      )}
    </HeaderContainer>
  );
};
