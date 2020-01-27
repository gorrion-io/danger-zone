import React, { useState } from 'react';
import { Input, Icon, Button } from 'antd';
import { LOGIN, SEND_MAGIC_LINK } from './login-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { saveTokenToLocalStorage, saveUserToLocalStorage } from '../../utils/helpers/local-storage.helper';
import { openInfoNotification, openErrorNotification } from '../../utils/notifications';
import jwt from 'jwt-decode';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({});
  const [login] = useMutation(LOGIN);
  const [sendMagicLink] = useMutation(SEND_MAGIC_LINK);

  const onLogin = async () => {
    if (!credentials.email || !credentials.password) {
      return;
    }

    const { data } = await login({
      variables: credentials,
    });

    if (data.login.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.login.message);
    } else {
      const user = jwt(data.login.token);
      saveUserToLocalStorage(user);
      saveTokenToLocalStorage(data.login);
    }

    setCredentials({});
  };

  const onSendMagicLink = async () => {
    if (!credentials.magicLinkEmail) {
      return;
    }

    const { data } = await sendMagicLink({
      variables: {
        email: credentials.magicLinkEmail,
      },
    });

    if (data.sendMagicLink.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.sendMagicLink.message);
    } else {
      openInfoNotification(data.sendMagicLink.message);
    }

    setCredentials({});
  };

  const updateField = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Input
          onChange={updateField}
          value={credentials.email}
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          name='email'
        />
        <Input onChange={updateField} value={credentials.password} type='password' placeholder='Password' name='password' />
        <Button onClick={onLogin}>Login</Button>
      </div>
      <div style={{ display: 'flex' }}>
        <Input
          onChange={updateField}
          value={credentials.magicLinkEmail}
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          name='magicLinkEmail'
        />
        <Button onClick={onSendMagicLink}>Send access link</Button>
      </div>
    </div>
  );
};
