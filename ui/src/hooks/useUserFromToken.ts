import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string[];
}

interface User {
  id: string;
  email: string;
  roles?: string[];
}
const useUserFromToken = (): User | null => {
  const getToken = (): string | undefined => Cookies.get('token');

  const getUser = (): User | null => {
    const token = getToken();
    if (!token) return null;

    try {
      // Use the jwtDecode with a generic type parameter to specify the expected return type
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);

      const user: User = {
        id: 
          decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ],
        email:
          decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
          ],
        roles: 
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] || []
      };
      return user;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  return getUser();
};

export default useUserFromToken;
