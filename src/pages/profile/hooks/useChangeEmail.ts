import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import APIClient,{ APIClientError } from '../../../services/apiClient';
import { EditUserResponse, ProfileData, ProfileDataWithJWT } from '../entities';
import {FormDataType as ChangeEmailBody} from '../components/ChangeEmailForm'

interface ChangeEmailContext {
    previusData?: ProfileData
}

const apiClient = new APIClient<ChangeEmailBody, ProfileDataWithJWT>("/users/email/me")


const useChangeEmail = () => {
    const queryClient = useQueryClient()
    return useMutation<ProfileDataWithJWT, APIClientError, ChangeEmailBody, ChangeEmailContext>({
        mutationFn: (data: ChangeEmailBody) => {
            return (apiClient.editOtherAndPreProcessWithHeader<ChangeEmailBody, EditUserResponse>(
                data,
                (data, token, tokenType) => ({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    weight: data.weight_lb,
                    token: token,
                    tokenType:tokenType
                })
            ))
        },
        onMutate: (newData: ChangeEmailBody) => {
            const previusData = queryClient.getQueryData<ProfileData>(['profile'])
            queryClient.setQueryData<ProfileData>(
                ['profile'], 
                currentData => (currentData? {...currentData, email: newData.email} : undefined)
            )

            return { previusData }
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('token_type', data.tokenType)
            toast.success("Your Email has been Updated.", {
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
        onError: (error, _, context) => {
            if(error.response) {
                if (typeof error.response.data.detail === "string")
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
                else toast.error("Something went wrong, please try again later.", {
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
            
            if (!context?.previusData) return
            queryClient.setQueryData<ProfileData>(
                ['profile'], 
                context.previusData
            )
        }
    })
}

export default useChangeEmail