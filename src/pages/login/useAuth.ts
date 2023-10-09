import jwtDecode from 'jwt-decode';

interface JwtPayloadType {
email: string;
  permissions: ("admin" | "master")[],
  active: boolean,
  exp: number
}

interface UserType {
    jtw: string;
    email: string;
    is_active: boolean;
    is_admin: boolean;
    is_master: boolean;
}

const useAuth = (): UserType | null => {
  const jwt = localStorage.getItem('token');
  if (!jwt) {
      return null; 
    }
  const jwtData = jwtDecode(jwt) as JwtPayloadType

  const expirationTime = jwtData.exp * 1000;
  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {
    localStorage.removeItem('token');
    return null;
  }

  const user = {
    jtw: jwt,
    email: jwtData.email,
    is_active: jwtData.active,
    is_admin: jwtData.permissions.includes("admin"),
    is_master: jwtData.permissions.includes("master")
  }

  return user;
}

export default useAuth