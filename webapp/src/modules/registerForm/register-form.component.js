import React, { useState, useCallback } from 'react';
import { Input, Icon, Button, Spin } from 'antd';
import { REGISTER } from './register-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification, openInfoNotification } from '../../utils/notifications';
import { saveTokenToLocalStorage, getUserFromLocalStorage } from '../../utils/helpers/local-storage.helper';
import { Redirect } from 'react-router-dom';

export const RegisterForm = () => {
  const [credentials, setCredentials] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [register, { loading: isLoading }] = useMutation(REGISTER);

  const onRegister = useCallback(async () => {
    const user = getUserFromLocalStorage();

    if (!user || !user._id || !user.userName) {
      openErrorNotification('Cannot claim an account. Create an account first.');
      return;
    }

    const { data } = await register({
      variables: { ...user, ...credentials },
    });

    if (data.register.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.register.message);
    } else {
      saveTokenToLocalStorage(data.register);
      openInfoNotification('Your account has been successfully registered!');
      setRedirect(true);
    }

    setCredentials({});
  }, [credentials]);

  const validatePassword = useCallback(() => {
    return credentials.password !== credentials.confirmPassword;
  }, [credentials]);

  const updateField = useCallback(
    (e) => {
      setCredentials({
        ...credentials,
        [e.target.name]: e.target.value,
      });
    },
    [credentials],
  );

  if (redirect) {
    return <Redirect to='/' />;
  }

  return (
    <Spin spinning={isLoading}>
      <div style={{ display: 'flex' }}>
        <Input
          onChange={updateField}
          value={credentials.email}
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          name='email'
        />
        <Input onChange={updateField} value={credentials.password} type='password' placeholder='Password' name='password' />
        <Input onChange={updateField} value={credentials.confirmPassword} type='password' placeholder='Confirm password' name='confirmPassword' />
        <Button onClick={onRegister} disabled={validatePassword()}>
          Register
        </Button>
      </div>
    </Spin>
  );
};
