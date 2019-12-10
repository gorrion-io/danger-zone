import React, { useState } from 'react';
import { Input, Icon, Button } from 'antd';
import { LOGIN } from './login-form.mutations';
import { useMutation } from '@apollo/react-hooks';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [login] = useMutation(LOGIN);

  return (
    <div style={{ display: 'flex' }}>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder='Username'
      />
      <Button
        onClick={async () => {
          const { data } = await login({ variables: { userName: username } });
          console.log(data.addUser.token)
          alert(data.addUser.token);
        }}>
        Create account
      </Button>
    </div>
  );
};
