import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, Popover } from 'antd';
import styled from 'styled-components';
import { AuthContext } from '../../contexts/auth.context';
import { LoginModal } from '../loginModal/login-modal.component';
import { RegisterForm } from '../registerForm/register-form.component';

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
  && {
    margin-left: 8px;
  }
`;

const RegisterButton = LoginButton;

export const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [showRegister, setShowRegister] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [registerBtnText, setRegisterBtnText] = useState('Register');

  useEffect(() => {
    const userName = authContext.isAuth ? authContext.payload.userName : '';
    setUserName(userName);
    setShowRegister(!authContext.payload.isActivated);
  }, [authContext]);

  useEffect(() => {
    setRegisterBtnText(popoverVisible ? 'Close' : 'Register');
  }, [popoverVisible]);

  const onLogout = useCallback(() => {
    authContext.logout();
  }, []);

  const registerForm = <RegisterForm onRegistered={() => setPopoverVisible(false)} />;

  return (
    <HeaderContainer>
      {userName ? (
        <LogInfoContainer>
          <UserName>Hello {userName}</UserName>
          <Button onClick={onLogout}>Logout</Button>
          {showRegister && (
            <Popover placement='bottomRight' content={registerForm} trigger='click' visible={popoverVisible}>
              <RegisterButton onClick={() => setPopoverVisible(!popoverVisible)}>{registerBtnText}</RegisterButton>
            </Popover>
          )}
        </LogInfoContainer>
      ) : (
        <LoginModal />
      )}
    </HeaderContainer>
  );
};
