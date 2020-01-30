import React, { useState, useCallback } from 'react';
import { Input, Icon, Button, Spin } from 'antd';
import { ADD_USER } from './add-user-form.mutations';
import { TOKEN } from '../loginForm/login-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { openErrorNotification, openInfoNotification } from '../../utils/notifications';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { saveUserToLocalStorage, saveTokenToLocalStorage } from '../../utils/helpers/local-storage.helper';

export const AddUserForm = () => {
  const [username, setUsername] = useState('');
  const [addUser, { loading: isAddUserLoading }] = useMutation(ADD_USER);
  const [getToken, { loading: isTokenLoading }] = useMutation(TOKEN);

  const onCreateAccount = useCallback(async () => {
    const userRes = await addUser({ variables: { userName: username } });

    if (userRes.data.addUser.__typename === ERROR_RESPONSE) {
      openErrorNotification(userRes.data.addUser.message);
      return;
    }

    const user = userRes.data.addUser;
    const userNameId = `${user.userName}-${user._id}`;
    const tokenData = await getToken({ variables: { userName: userNameId } });

    if (tokenData.data.token.__typename === ERROR_RESPONSE) {
      openErrorNotification(tokenData.data.token.message);
      return;
    }

    saveTokenToLocalStorage(tokenData.data.token);
    saveUserToLocalStorage(user);

    openInfoNotification('Your account has been created!');

    setUsername('');
  }, [username]);

  return (
    <Spin spinning={isTokenLoading || isAddUserLoading}>
      <div style={{ display: 'flex' }}>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Username'
        />
        <Button onClick={onCreateAccount}>Create an account</Button>
      </div>
    </Spin>
  );
};
