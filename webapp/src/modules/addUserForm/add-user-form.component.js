import React, { useState } from 'react';
import { Input, Icon, Button } from 'antd';
import { ADD_USER } from './add-user-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { USER_ID, USER_NAME } from '../../utils/constants/local-storage.const';

export const AddUserForm = () => {
  const [username, setUsername] = useState('');
  const [addUser] = useMutation(ADD_USER);

  // const setAuthToken = (token) => {
  //   localStorage.setItem(AUTH_TOKEN, token.token);
  //   localStorage.setItem(REFRESH_TOKEN, token.refreshToken);
  // }

  const saveUser = (user) => {
    localStorage.setItem(USER_ID, user._id);
    localStorage.setItem(USER_NAME, user.userName);
  };

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
          const { data } = await addUser({ variables: { userName: username } });
          saveUser(data.addUser);
        }}>
        Create an account
      </Button>
    </div>
  );
};
