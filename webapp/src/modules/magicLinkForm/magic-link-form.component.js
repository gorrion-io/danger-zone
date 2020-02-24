import React, { useState, useCallback } from 'react';
import { Input, Icon, Button, Spin } from 'antd';
import { SEND_MAGIC_LINK } from './magic-link-form.mutations';
import { useMutation } from '@apollo/react-hooks';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openInfoNotification, openErrorNotification } from '../../utils/notifications';

export const MagicLinkForm = () => {
  const [email, setEmail] = useState('');
  const [sendMagicLink, { loading: isSendMLLoading }] = useMutation(SEND_MAGIC_LINK);

  const onSendMagicLink = useCallback(async () => {
    if (!email) {
      return;
    }

    const { data } = await sendMagicLink({
      variables: { email: email },
    });

    if (data.sendMagicLink.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.sendMagicLink.message);
    } else {
      openInfoNotification(data.sendMagicLink.message);
    }

    setEmail('');
  }, [email]);

  return (
    <Spin spinning={isSendMLLoading}>
      <div style={{ display: 'flex' }}>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          name='magicLinkEmail'
        />
        <Button onClick={onSendMagicLink}>Send access link</Button>
      </div>
    </Spin>
  );
};
