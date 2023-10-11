import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';

import APIClient, {APIClientError} from '../../services/apiClient';
import { AccessToken } from '../login/useLogin';

interface UserRegisterData {
    name: string;
    email: string;
    password: string;
}

const apiClient = new APIClient<UserRegisterData, AccessToken>("/users")

const useRegister = (onRegister: () => void) => {

    return useMutation<AccessToken, APIClientError, UserRegisterData>({
        mutationFn: (data: UserRegisterData) => apiClient.postWithoutAuth(data),
        onSuccess: (JWTData) => {
            localStorage.setItem('token', JWTData.access_token)
            localStorage.setItem('token_type', JWTData.token_type)
            onRegister()
        },
        onError: (error: APIClientError) => {
            if(error.response && error.response.status === 400)
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

export default useRegister;