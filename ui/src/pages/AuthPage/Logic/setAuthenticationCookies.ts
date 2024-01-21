import Cookies from 'js-cookie';

const setAuthenticationCookies = (token: string) => {
  Cookies.set('token', token);
  Cookies.set('isAuthenticated', 'true');
};
export default setAuthenticationCookies;
