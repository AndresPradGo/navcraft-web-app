import { useMutation, useQueryClient} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import {apiClient} from './useEditRunway'
import { AerodromeDataFromAPI } from '../../services/userAerodromeClient';


interface DeleteRunwayData {
    name: string;
    id: number;
    aerodrome_id: number;
}

interface AerodromeContext {
    previusData?: AerodromeDataFromAPI
}

const useDeleterunway = () => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, DeleteRunwayData, AerodromeContext>({
        mutationFn: (data) => apiClient.delete(`/${data.id}`),
        onMutate: (newData) => {
            const previusData = queryClient.getQueryData<AerodromeDataFromAPI>(['aerodrome', newData.aerodrome_id])
            queryClient.setQueryData<AerodromeDataFromAPI>(
                ['aerodrome', newData.aerodrome_id], 
                currentData => (
                    currentData ? {...currentData, runways: currentData.runways.filter(item => item.id !== newData.id)} : undefined
                )
            )
            return { previusData }
        },
        onSuccess: (_, newData) => {
            queryClient.invalidateQueries({queryKey: ['aerodrome', newData.aerodrome_id]})
            toast.info(`"Runway ${newData.name}" has been deleted.`, {
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
        onError: (error, newData, context) => {
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
            queryClient.setQueryData<AerodromeDataFromAPI>(
                ['aerodrome', newData.aerodrome_id], 
                context.previusData
            )
        }
    })
}

export default useDeleterunway