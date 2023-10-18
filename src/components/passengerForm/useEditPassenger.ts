import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import APIClient, { APIClientError } from '../../services/apiClient';
import {FormDataType} from './PassengerForm'
import {PassengerData as PassengerDataInCache} from '../../hooks/usePassengersData'
interface PassengerData extends FormDataType {
    id: number;
}

interface PassengerContext {
    previusData?: PassengerDataInCache[]
}

const apiClient = new APIClient<FormDataType, PassengerData>('users/passenger-profile')

const useEditPassenger = () => {
    const queryClient = useQueryClient()
    return useMutation<PassengerData, APIClientError, PassengerData, PassengerContext>({
        mutationFn: (data) => {
            if (data.id !== 0) return apiClient.edit(data, `/${data.id}`)
            return apiClient.post(data)
        },
        onMutate: (newData) => {
            const previusData = queryClient.getQueryData<PassengerDataInCache[]>(['passengers'])
            queryClient.setQueryData<PassengerDataInCache[]>(
                ['passengers'], 
                currentData => {
                    if(newData.id !== 0){
                        return currentData?.map(item => {
                            if (item.id === newData.id)
                                return {id: newData.id, name: newData.name, weight_lb: newData.weight_lb}
                            return item
                        })
                    }
                    return [ {id: newData.id, name: newData.name, weight_lb: newData.weight_lb}, ...(currentData || []) ]
                }
            )
            return { previusData }
        },
        onSuccess: (savedData, newData) => {
            toast.success(newData.id !== 0 
                ? `Passenger "${savedData.name}" has been updated.` 
                : `Passenger "${savedData.name}" has been added.` , {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            queryClient.setQueryData<PassengerDataInCache[]>(
                ['passengers'], 
                (passengers) => ( passengers?.map(item => {
                    if (
                        (newData.id !== 0 && item.id === savedData.id) 
                        || ((newData.id === 0 && item.id === 0))
                    ) {
                        return ({
                            id: savedData.id,
                            name:savedData.name,
                            weight_lb: savedData.weight_lb
                        })
                    }
                    return item
                }))
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
            queryClient.setQueryData<PassengerDataInCache[]>(
                ['passengers'], 
                context.previusData
            )
        }
    })
}

export default useEditPassenger