import React, { useEffect, useState, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_BY_MAGIC_LINK } from './magic-link-handler.mutations';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification } from '../../utils/notifications';
import { AuthContext } from '../../contexts/auth.context';

export const MagicLinkHandler = () => {
  const { id } = useParams();
  const authContext = useContext(AuthContext);
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
          authContext.login(data.loginByMagicLink);
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
