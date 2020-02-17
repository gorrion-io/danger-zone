import React, { useEffect, useState, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { ACTIVATE_ACCOUNT } from './activate-account-handler.mutations';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification } from '../../utils/notifications';
import { AuthContext } from '../../contexts/auth.context';

export const ActivateAccountHandler = () => {
  const { id } = useParams();
  const authContext = useContext(AuthContext);
  const [activateAccountMutation] = useMutation(ACTIVATE_ACCOUNT);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (id) {
        const { data } = await activateAccountMutation({
          variables: { linkId: id },
        });

        if (data.activateAccount.__typename === ERROR_RESPONSE) {
          openErrorNotification(data.activateAccount.message);
        } else {
          authContext.login(data.activateAccount);
          setRedirect(true);
        }
      }
    };

    activateAccount();
  }, []);

  if (redirect) {
    return <Redirect to='/' />;
  }

  return <div>Please wait...</div>;
};
