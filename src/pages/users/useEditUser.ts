import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import {APIClientError} from '../../services/apiClient';
import apiClient, {UserDataFromAPI, EditUserData} from './userService'
import errorToast from '../../utils/errorToest';

interface EditUserDataWithId extends EditUserData{
    id: number
}

interface UsersContext {
    previusData?: UserDataFromAPI[]
}
const useEditUser = () => {
    const queryClient = useQueryClient()
    return useMutation<UserDataFromAPI, APIClientError, EditUserDataWithId, UsersContext>({
        mutationFn: (data) => {
            return apiClient.edit({
                make_admin: data.make_admin,
                activate: data.activate 
            }, `/${data.id}`)
        },
        onMutate: (newData) => {
            const previusData = queryClient.getQueryData<UserDataFromAPI[]>(['users'])
            queryClient.setQueryData<UserDataFromAPI[]>(
                ['users'], 
                currentData => {
                    return currentData?.map(item => {
                        if (item.id === newData.id)
                            return {...item, is_admin: newData.make_admin, is_active: newData.activate}
                        return item
                    }) || []
                }
            )
            return { previusData }
        },
        onSuccess: (savedData, newData) => {
            toast.success(`User "${savedData.name}" has been updated.`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            queryClient.setQueryData<UserDataFromAPI[]>(
                ['users'], 
                currentData => {
                    return currentData?.map(item => {
                        if (item.id === newData.id)
                            return {...savedData}
                        return item
                    }) || []
                }
            )
        },
        onError: (error, _, context) => {
            errorToast(error)
            if (!context?.previusData) return
            queryClient.setQueryData<UserDataFromAPI[]>(
                ['users'], 
                context.previusData
            )
        }
    })
}

export default useEditUser