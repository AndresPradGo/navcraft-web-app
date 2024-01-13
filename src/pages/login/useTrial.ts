import { useMutation } from "@tanstack/react-query";

import APIClient, {APIClientError} from '../../services/apiClient';
import { AccessToken } from '../login/useLogin';
import errorToast from '../../utils/errorToast';

const apiClient = new APIClient<string, AccessToken>("/users/trial")

const useTrial = (onSubmission: () => void) => {
    return useMutation<AccessToken, APIClientError>({
        mutationFn: () => apiClient.postWithoutAuth(""),
        onSuccess: (JWTData) => {
            localStorage.setItem('token', JWTData.access_token)
            localStorage.setItem('token_type', JWTData.token_type)
            onSubmission()
        },
        onError: (error: APIClientError) => {
            if(error.response && error.response.status === 400)
                errorToast(error)
        }
      });
}

export default useTrial