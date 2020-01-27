import React from 'react';
import styled from 'styled-components';
import { LoginForm } from '../loginForm/login-form.component';
import { RegistrationForm } from '../registrationForm/registration-form.component';
import { MED_BREAKPOINT } from '../../constants';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100%;

  @media (min-width: ${MED_BREAKPOINT}) {
    flex-flow: row nowrap;
    align-items: flex-start;
  }
`;

export const LoginRegistrationPage = () => (
  <Wrapper>
    <LoginForm />
    <RegistrationForm />
  </Wrapper>
);
