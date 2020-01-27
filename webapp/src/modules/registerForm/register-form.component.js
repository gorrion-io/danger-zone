import React, { useState } from 'react';
import { Input, Icon, Button } from 'antd';
import { REGISTER } from './register-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification } from '../../utils/notifications';
import { saveTokenToLocalStorage, getUserFromLocalStorage } from '../../utils/helpers/local-storage.helper';

export const RegisterForm = () => {
  const [credentials, setCredentials] = useState({});
  const [register] = useMutation(REGISTER);

  const onRegister = async () => {
    const user = getUserFromLocalStorage();
    const { data } = await register({
      variables: { ...user, ...credentials },
    });

    if (data.register.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.register.message);
    } else {
      saveTokenToLocalStorage(data.register);
    }

    setCredentials({});
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
  );
};
