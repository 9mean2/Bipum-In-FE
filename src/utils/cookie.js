import { Cookies } from 'react-cookie';
import QUERY from '../constants/query';

const cookies = new Cookies();

export const setCookie = (name, value, option) => {
  const expires = new Date();

  name === QUERY.COOKIE.COOKIE_NAME
    ? expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000)
    : expires.setTime(expires.getTime() + 31 * 24 * 60 * 60 * 1000);
  return cookies.set(name, value, {
    path: '/',
    //httpOnly: true, //서버에서만 쿠키를 읽을 수 있음
    expires,
  });
};

export const getCookie = name => {
  return cookies.get(name);
};

export const removeCookie = (name, option) => {
  return cookies.remove(name, { ...option });
};
