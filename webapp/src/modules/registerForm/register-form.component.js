import React, { useState, useCallback, useContext } from 'react';
import { Input, Icon, Button, Spin } from 'antd';
import { REGISTER } from './register-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification, openInfoNotification } from '../../utils/notifications';
import { AuthContext } from '../../contexts/auth.context';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
`;

const FormButton = styled(Button)`
  && {
    margin-left: 8px;
  }
`;

export const RegisterForm = (props) => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
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
    }

    props.onRegistered();
  }, [email, authContext]);

  return (
    <Spin spinning={isLoading}>
      <FormContainer>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          name='email'
        />
        <FormButton onClick={onRegister}>Register</FormButton>
      </FormContainer>
    </Spin>
  );
};
