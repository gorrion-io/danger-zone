import { USER_ID, USER_NAME, AUTH_TOKEN, REFRESH_TOKEN } from '../../utils/constants/local-storage.const';

export function saveUserToLocalStorage(user) {
  localStorage.setItem(USER_ID, user._id);
  localStorage.setItem(USER_NAME, user.userName);
}

export function saveTokenToLocalStorage(token) {
  localStorage.setItem(AUTH_TOKEN, token.token);
  localStorage.setItem(REFRESH_TOKEN, token.refreshToken);
}

export function getUserFromLocalStorage() {
  return {
    _id: localStorage.getItem(USER_ID),
    userName: localStorage.getItem(USER_NAME),
  };
}

export function getTokenFromLocalStorage() {
  return {
    token: localStorage.getItem(AUTH_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
  };
}

export function removeTokenFromLocalStorage() {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}
