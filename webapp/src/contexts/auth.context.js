import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getTokenFromLocalStorage, saveTokenToLocalStorage, removeTokenFromLocalStorage } from '../utils/helpers/local-storage.helper';
import jwt from 'jwt-decode';

export const AuthContext = createContext({
  isAuth: false,
  user: null,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const setAuthentication = useCallback((token) => {
    const user = jwt(token);
    setUser(user);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token && token.token) {
      setAuthentication(token.token);
    }
  }, []);

  const loginHandler = useCallback((token) => {
    setAuthentication(token.token);
    saveTokenToLocalStorage(token);
  }, []);

  const logoutHandler = useCallback(() => {
    setIsAuthenticated(false);
    removeTokenFromLocalStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ login: loginHandler, logout: logoutHandler, isAuth: isAuthenticated, user: user }}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
