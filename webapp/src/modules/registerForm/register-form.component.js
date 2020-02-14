import React, { useState, useCallback, useContext } from 'react';
import { Input, Icon, Button, Spin } from 'antd';
import { REGISTER } from './register-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification, openInfoNotification } from '../../utils/notifications';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth.context';

export const RegisterForm = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [register, { loading: isLoading }] = useMutation(REGISTER);

  const onRegister = useCallback(async () => {
    const user = authContext.payload;

    if (!user || !user._id || !user.userName) {
      openErrorNotification('Cannot claim an account. Create an account first.');
      return;
    }

    const { data } = await register({
      variables: { ...user, email },
    });

    if (data.register.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.register.message);
    } else {
      openInfoNotification(data.register.message);
      setRedirect(true);
    }
  }, [email, authContext]);

  if (redirect) {
    return <Redirect to='/' />;
  }

  return (
    <Spin spinning={isLoading}>
      <div style={{ display: 'flex' }}>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          name='email'
        />
        <Button onClick={onRegister}>Register</Button>
      </div>
    </Spin>
  );
};
