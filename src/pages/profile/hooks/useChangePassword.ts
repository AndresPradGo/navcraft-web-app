
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';


import APIClient, { APIClientError } from '../../../services/apiClient';
import { EditUserResponse, ProfileData, ProfileDataWithJWT } from '../entities';
import errorToast from '../../../utils/errorToast';


interface ChangePasswordBody {
    password: string;
    current_password: string;
}

const apiClient = new APIClient<ChangePasswordBody, ProfileDataWithJWT>("/users/password/me")


const useChangePassword = () => {
    const queryClient = useQueryClient()
    return useMutation<ProfileDataWithJWT, APIClientError, ChangePasswordBody>({
        mutationFn: (data) => {
            return apiClient.editOtherAndPreProcessWithHeader<ChangePasswordBody, EditUserResponse>(
                data, 
                (preProcessedData, token , tokenType) => ({
                    id: preProcessedData.id,
                    name: preProcessedData.name,
                    email: preProcessedData.email,
                    weight: preProcessedData.weight_lb,
                    token: token,
                    tokenType:tokenType
                })
            )
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('token_type', data.tokenType)
            toast.success("Your Password has been Updated.", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<ProfileData>(
                ['profile'], 
                {
                    id: data.id,
                    name:  data.name,
                    email: data.email,
                    weight: data.weight
                }
            )
        },
        onError: (error) => {errorToast(error)}
    })
}

export default useChangePassword