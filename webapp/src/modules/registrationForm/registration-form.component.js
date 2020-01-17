import React, { useReducer } from 'react';
import { formReducer as reducer } from '../../reducers';
import { SET_NAME, SET_PASSWORD, SET_USERNAME, SET_SURNAME, MED_BREAKPOINT } from '../../constants';
import { Icon, Button, Typography } from 'antd';
import styled from 'styled-components';
import { FormControl } from '../shared/form-control.component';

const initialState = {
  username: '',
  password: '',
  name: '',
  surname: '',
};

const FormWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2% 0;

  @media (min-width: ${MED_BREAKPOINT}px) {
    padding: 2% 10%;
    height: 100%;
    width: 60%;
  }
`;

const { Title } = Typography;

export const RegistrationForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormWrapper>
      <Title level={2} style={{ textAlign: 'center', marginTop: '.5em' }}>
        No account yet?
        <br />
        Register here
      </Title>

      <FormControl
        inputId='registration-username'
        labelText='Username'
        inputType='text'
        inputPlaceholder='Username'
        inputValue={state.username}
        inputOnChange={(e) => dispatch({ type: SET_USERNAME, payload: e.target.value })}
        inputPrefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
      />
      <FormControl
        inputId='registration-password'
        labelText='Password'
        inputType='password'
        inputPlaceholder='Password'
        inputValue={state.password}
        inputOnChange={(e) => dispatch({ type: SET_PASSWORD, payload: e.target.value })}
        inputPrefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
      />
      <FormControl
        inputId='registration-name'
        labelText='Name'
        inputType='text'
        inputPlaceholder='John'
        inputValue={state.name}
        inputOnChange={(e) => dispatch({ type: SET_NAME, payload: e.target.value })}
      />
      <FormControl
        inputId='registration-surname'
        labelText='Surname'
        inputType='text'
        inputPlaceholder='Doe'
        inputValue={state.surname}
        inputOnChange={(e) => dispatch({ type: SET_SURNAME, payload: e.target.value })}
      />

      <Button type='primary' onClick={() => alert('registration')}>
        Create an account
      </Button>
    </FormWrapper>
  );
};
