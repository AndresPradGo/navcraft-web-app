import { useMutation } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../../services/apiClient';
import { AccessToken } from '../login/useLogin';
import errorToast from '../../utils/errorToast';

interface UserRegisterData {
  name: string;
  email: string;
  password: string;
}

const apiClient = new APIClient<UserRegisterData, AccessToken>('/users');

const useRegister = (onRegister: () => void) => {
  return useMutation<AccessToken, APIClientError, UserRegisterData>({
    mutationFn: (data: UserRegisterData) => apiClient.postWithoutAuth(data),
    onSuccess: (JWTData) => {
      localStorage.setItem('token', JWTData.access_token);
      localStorage.setItem('token_type', JWTData.token_type);
      onRegister();
    },
    onError: (error: APIClientError) => {
      if (error.response && error.response.status === 400) errorToast(error);
    },
  });
};

export default useRegister;
