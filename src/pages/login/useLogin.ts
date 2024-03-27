import { useMutation } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../../services/apiClient';
import errorToast from '../../utils/errorToast';

export interface AccessToken {
  access_token: string;
  token_type: string;
}

const apiClient = new APIClient<FormData, AccessToken>('/login');

const useLogin = (onLogin: () => void) => {
  return useMutation<AccessToken, APIClientError, FormData>({
    mutationFn: (data: FormData) => apiClient.postWithoutAuth(data),
    onSuccess: (JWTData) => {
      localStorage.setItem('token', JWTData.access_token);
      localStorage.setItem('token_type', JWTData.token_type);
      onLogin();
    },
    onError: (error: APIClientError) => {
      if (error.response && error.response.status === 401) errorToast(error);
    },
  });
};

export default useLogin;
