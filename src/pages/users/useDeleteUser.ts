import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import APIClient, { APIClientError } from '../../services/apiClient';
import {UserDataFromAPI} from './userService'


interface DeleteUserData {
    name: string;
    id: number;
}

interface DeleteUserContext {
    previusData?: UserDataFromAPI[]
}


const apiClient = new APIClient("users")

const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteUserData, DeleteUserContext>({
        mutationFn: (data) => apiClient.delete(`/${data.id}`),
        onMutate: (data) => {
            const previusData = queryClient.getQueryData<UserDataFromAPI[]>(['users'])
            queryClient.setQueryData<UserDataFromAPI[]>(
                ['users'], 
                currentData => (
                    currentData ? currentData.filter(item => item.id !== data.id) : []
                )
            )
            return { previusData }
        },
        onSuccess: (_, user) => {
            queryClient.invalidateQueries({queryKey: ['users']})
            toast.success(`"${user.name}'s" profile has been deleted successfully.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
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
            } else toast.error("Something went wrong, please try again later.", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            if (!context) return
            queryClient.setQueryData<UserDataFromAPI[]>(
                ['users'], 
                context.previusData
            )
        }
    })
};

export default useDeleteUser;