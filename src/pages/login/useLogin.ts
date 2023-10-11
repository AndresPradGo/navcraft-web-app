import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';

import APIClient, {APIClientError} from '../../services/apiClient';

export interface AccessToken {
    access_token: string;
    token_type: string; 
}

const apiClient = new APIClient<FormData, AccessToken>("/login")

const useLogin = (onLogin: () => void) => {

    return useMutation<AccessToken, APIClientError, FormData>({
        mutationFn: (data: FormData) => apiClient.postWithoutAuth(data),
        onSuccess: (JWTData) => {
            localStorage.setItem('token', JWTData.access_token)
            localStorage.setItem('token_type', JWTData.token_type)
            onLogin()
        },
        onError: (error: APIClientError) => {
            if(error.response && error.response.status === 401)
                toast.error(error.response.data.detail, {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
        }
      });

}

export default useLogin;