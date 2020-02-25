import React, { useState, useCallback, useContext } from 'react';
import { Input, Icon, Button, Spin } from 'antd';
import { ADD_USER, TOKEN } from './add-user-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { openErrorNotification, openInfoNotification } from '../../utils/notifications';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { AuthContext } from '../../contexts/auth.context';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const FormButton = styled(Button)`
  && {
    width: 100%;
    margin-top: 8px;
  }
`;

const UserNameInput = styled(Input)`
  && {
    margin-right: 8px;
  }
`;

export const AddUserForm = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [addUser, { loading: isAddUserLoading }] = useMutation(ADD_USER);
  const [getToken, { loading: isTokenLoading }] = useMutation(TOKEN);

  const onCreateAccount = useCallback(async () => {
    if (!username) {
      return;
    }

    const userRes = await addUser({ variables: { userName: username } });

    if (userRes.data.addUser.__typename === ERROR_RESPONSE) {
      openErrorNotification(userRes.data.addUser.message);
      return;
    }

    const user = userRes.data.addUser;
    const tokenData = await getToken({ variables: { userId: user._id } });

    if (tokenData.data.token.__typename === ERROR_RESPONSE) {
      openErrorNotification(tokenData.data.token.message);
      return;
    }
    authContext.login(tokenData.data.token);

    openInfoNotification('Your account has been created!');

    setUsername('');
  }, [username]);

  return (
    <Spin spinning={isTokenLoading || isAddUserLoading}>
      <FormContainer>
        <UserNameInput
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='User name'
        />
        <FormButton onClick={onCreateAccount}>Create</FormButton>
      </FormContainer>
    </Spin>
  );
};
