import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_BY_MAGIC_LINK } from './magic-link-handler.mutations';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { saveTokenToLocalStorage, saveUserToLocalStorage } from '../../utils/helpers/local-storage.helper';
import { openErrorNotification } from '../../utils/notifications';
import jwt from 'jwt-decode';

export const MagicLinkHandler = () => {
  const { id } = useParams();
  const [login] = useMutation(LOGIN_BY_MAGIC_LINK);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const logIn = async () => {
      if (id) {
        const { data } = await login({
          variables: { linkId: id },
        });

        if (data.loginByMagicLink.__typename === ERROR_RESPONSE) {
          openErrorNotification(data.loginByMagicLink.message);
        } else {
          const user = jwt(data.loginByMagicLink.token);
          saveUserToLocalStorage(user);
          saveTokenToLocalStorage(data.loginByMagicLink);
          setRedirect(true);
        }
      }
    };

    logIn();
  }, []);

  if (redirect) {
    return <Redirect to='/' />;
  }

  return <div>Please wait...</div>;
};
