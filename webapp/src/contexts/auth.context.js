import React, { createContext, useState, useCallback, useEffect } from 'react';
import jwt from 'jwt-decode';
import useLocalStorage from '../utils/custom-hooks/use-local-storage.hook';
import { AUTH_TOKEN, REFRESH_TOKEN } from '../utils/constants/local-storage.const';
import { getTokenObjectToSave, isExpired } from '../utils/helpers/auth-token.helper';

export const AuthContext = createContext({
  isAuth: false,
  payload: null,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState({});
  const [token, setToken, removeToken] = useLocalStorage(AUTH_TOKEN, null);
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage(REFRESH_TOKEN, null);

  const setAuthentication = useCallback((token, payload) => {
    setPayload(payload);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (token && token.token && !isExpired(refreshToken)) {
      const payload = jwt(token.token);
      setAuthentication(token, payload);
    } else {
      logoutHandler();
    }
  }, []);

  const loginHandler = useCallback((token) => {
    const payload = jwt(token.token);

    setAuthentication(token, payload);
    setToken(getTokenObjectToSave(token.token));
    setRefreshToken(getTokenObjectToSave(token.refreshToken));
  }, []);

  const logoutHandler = useCallback(() => {
    setIsAuthenticated(false);
    removeToken();
    removeRefreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ login: loginHandler, logout: logoutHandler, isAuth: isAuthenticated, payload: payload }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
