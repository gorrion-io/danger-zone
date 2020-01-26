import React, { useReducer } from 'react';
import { Icon, Button, Typography } from 'antd';
import { LOGIN } from './login-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';
import { MED_BREAKPOINT, SET_USERNAME, SET_PASSWORD } from '../../constants';
import { formReducer as reducer } from '../../reducers';
import { FormControl } from '../shared/form-control.component';
import { FormWrapper } from '../shared/form-wrapper.component';

const initialState = {
  username: '',
  password: '',
};

const LoginFormWrapper = styled(FormWrapper)`
  @media (min-width: ${MED_BREAKPOINT}) {
    padding: 2% 5%;
    height: 100%;
    width: 40%;
  }
`;

const { Title } = Typography;

export const LoginForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [login] = useMutation(LOGIN);

  return (
    <LoginFormWrapper>
      <Title level={2} style={{ textAlign: 'center', marginTop: '.5em' }}>
        Login
      </Title>

      <FormControl
        inputId='login-username'
        labelText='Username'
        inputType='text'
        inputPlaceholder='Username'
        inputValue={state.username}
        inputOnChange={(e) => dispatch({ type: SET_USERNAME, payload: e.target.value })}
        inputPrefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
      />
      <FormControl
        inputId='login-password'
        labelText='Password'
        inputType='password'
        inputPlaceholder='Password'
        inputValue={state.password}
        inputOnChange={(e) => dispatch({ type: SET_PASSWORD, payload: e.target.value })}
        inputPrefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
      />

      <Button
        type='primary'
        onClick={async () => {
          const { data } = await login({ variables: { userName: state.username } });
          alert(data.addUser.token);
        }}>
        Login
      </Button>
    </LoginFormWrapper>
  );
};
