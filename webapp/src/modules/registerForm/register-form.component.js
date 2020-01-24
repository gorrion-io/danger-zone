import React, { useState } from 'react';
import { Input, Icon, Button } from 'antd';
import { REGISTER } from './register-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { AUTH_TOKEN, REFRESH_TOKEN, USER_ID, USER_NAME } from '../../utils/constants/local-storage.const';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification } from '../../utils/notifications';

export const RegisterForm = () => {
  const [credentials, setCredentials] = useState({});
  const [register] = useMutation(REGISTER);

  const setAuthToken = (token) => {
    localStorage.setItem(AUTH_TOKEN, token.token);
    localStorage.setItem(REFRESH_TOKEN, token.refreshToken);
  };

  const getUser = () => {
    return {
      id: localStorage.getItem(USER_ID),
      userName: localStorage.getItem(USER_NAME),
    };
  };

  const onRegister = async () => {
    const user = getUser();
    const { data } = await register({
      variables: {
        id: user.id,
        email: credentials.email,
        password: credentials.password,
      },
    });

    if (data.register.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.register.message);
    } else {
      setAuthToken(data.register);
    }
  };

  const validatePassword = () => {
    return credentials.password !== credentials.confirmPassword;
  };

  const updateField = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Input
        onChange={updateField}
        value={credentials.email}
        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder='Email'
        name='email'
      />
      <Input
        onChange={updateField}
        value={credentials.password}
        type='password'
        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder='Password'
        name='password'
      />
      <Input
        onChange={updateField}
        value={credentials.confirmPassword}
        type='password'
        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder='Confirm password'
        name='confirmPassword'
      />
      <Button onClick={onRegister} disabled={validatePassword()}>
        Register
      </Button>
    </div>
  );
};
