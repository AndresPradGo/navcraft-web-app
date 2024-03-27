import jwtDecode from 'jwt-decode';

interface JwtPayloadType {
  email: string;
  permissions: ('admin' | 'master')[];
  active: boolean;
  exp: number;
}

interface UserType {
  jwt: string;
  jwtType: string;
  authorization: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  is_master: boolean;
}

const useAuth = (): UserType | null => {
  const jwt = localStorage.getItem('token');
  const jwtType = localStorage.getItem('token_type');
  if (!jwt || !jwtType) {
    return null;
  }
  const jwtData = jwtDecode(jwt) as JwtPayloadType;

  const user = {
    jwt,
    jwtType,
    authorization: `${jwtType} ${jwt}`,
    email: jwtData.email,
    is_active: jwtData.active,
    is_admin: jwtData.permissions.includes('admin'),
    is_master: jwtData.permissions.includes('master'),
  };

  return user;
};

export default useAuth;
